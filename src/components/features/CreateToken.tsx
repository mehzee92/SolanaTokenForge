import { FC, useCallback, useEffect, useState, Dispatch, SetStateAction, useRef, useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, Connection } from '@solana/web3.js';
import { notify } from "../../utils/notifications";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TokenOwnership } from "./TokenOwnership";
import { NetworkContext } from '../../contexts/ContextProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { sendTransactionWithRetry } from '../../utils/transaction';
import { getWorkingConnection } from '../../utils/rpc';
import { validateTransactionFeasibility } from '../../utils/transactionValidation';
import { getDetailedErrorMessage } from '../../utils/errors';

type AIImageResponse = {
  status: string;
  output: string[];
};

const generateAIImage = async (prompt: string): Promise<string> => {
  try {
    if (!process.env.NEXT_PUBLIC_MODELSLAB_API_KEY) {
      throw new Error('API key not configured');
    }

    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://modelslab.com/api/v6/realtime/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'key': process.env.NEXT_PUBLIC_MODELSLAB_API_KEY
      },
      body: JSON.stringify({
        key: process.env.NEXT_PUBLIC_MODELSLAB_API_KEY,
        prompt: prompt,
        negative_prompt: "bad quality, blurry, distorted",
        width: "512",
        height: "512",
        safety_checker: true,
        samples: 1,
        base64: false,
        instant_response: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Initial API Response:', data);

    // Handle immediate success response
    if (data.status === "success" && data.output?.[0]) {
      return data.output[0];
    }

    // Handle task-based response
    if (data.task_id || data.request_id) {
      const taskId = data.task_id || data.request_id;
      const MAX_ATTEMPTS = 30;
      const POLL_INTERVAL = 2000;

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

        const statusResponse = await fetch(`https://modelslab.com/api/v6/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'key': process.env.NEXT_PUBLIC_MODELSLAB_API_KEY
          }
        });

        if (!statusResponse.ok) {
          console.error(`Poll attempt ${i + 1} failed:`, await statusResponse.text());
          continue;
        }

        const statusData = await statusResponse.json();
        console.log(`Poll attempt ${i + 1}:`, statusData);

        if (statusData.status === "completed" && (statusData.images?.[0] || statusData.output?.[0])) {
          return statusData.images?.[0] || statusData.output?.[0];
        }

        if (statusData.status === "failed") {
          throw new Error('Image generation failed: ' + (statusData.message || 'Unknown error'));
        }
      }

      throw new Error('Timeout: Image generation took too long');
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error generating AI image:', error);
    notify({ 
      type: 'error', 
      message: 'AI Generation Error',
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

const uploadImageAndMetadata = async (
  tokenName: string, 
  symbol: string, 
  imageFile: File | null,
  imageUrl: string | null
): Promise<string> => {
  try {
    if (!imageUrl) {
      throw new Error('No image URL available');
    }

    // Convert image URL to base64 if it's not already
    let finalImageUrl = imageUrl;
    if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('https://')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      finalImageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    const metadata = {
      name: tokenName,
      symbol: symbol,
      description: `${tokenName} token created with TokenForge`,
      image: finalImageUrl,
      external_url: "",
      animation_url: "",
      attributes: [],
      properties: {
        files: [{
          uri: finalImageUrl,
          type: "image/png",
          cdn: false
        }],
        category: "image",
      },
      seller_fee_basis_points: 0
    };

    // Use NFT.Storage or similar service for permanent storage
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'metadata.json': {
            content: JSON.stringify(metadata, null, 2)
          }
        },
        public: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata');
    }

    const data = await response.json();
    const metadataUrl = `https://gist.githubusercontent.com/raw/${data.id}/metadata.json`;
    
    // Verify metadata is accessible and contains valid image
    const verifyResponse = await fetch(metadataUrl);
    if (!verifyResponse.ok) {
      throw new Error('Failed to verify metadata accessibility');
    }

    return metadataUrl;
  } catch (error) {
    console.error('Error uploading metadata:', error);
    throw error;
  }
};

// Add this function before the CreateToken component
const generateMetadata = (name: string, symbol: string, imageUrl: string) => {
  return {
    name: name,
    symbol: symbol,
    uri: imageUrl,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
  };
};

interface CreateTokenProps {
  onStepChange: Dispatch<SetStateAction<number>>;
  layout?: 'horizontal' | 'vertical';
}

export const CreateToken: FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const { network } = useContext(NetworkContext);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const initConnection = async () => {
      try {
        const conn = await getWorkingConnection(network);
        if (!mounted) return;
        
        // Test connection before setting
        const testResult = await validateConnection(conn);
        if (!testResult) {
          throw new Error('Connection validation failed');
        }
        
        setConnection(conn);
        
      } catch (error) {
        console.error('Connection error:', error);
        notify({ 
          type: 'error', 
          message: 'Network Error', 
          description: 'Failed to establish reliable connection. Please try again.',
          network
        });
      }
    };

    initConnection();
    return () => { mounted = false; };
  }, [network]);

  const [formData, setFormData] = useState({
    tokenName: '',
    symbol: '',
    amount: '1000',
    decimals: '5',
    description: '',
    image: null as File | null,
    metadataUrl: '',
    transferFeeEnabled: false,
    feeBasisPoints: 100,
    maxFee: '100',
    withdrawAuthority: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [mintAddress, setMintAddress] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
  const [newOwner, setNewOwner] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const confirmMainnetTransaction = useCallback(() => {
    if (network !== WalletAdapterNetwork.Mainnet) return true;
    return window.confirm(
      'You are about to create a token on mainnet. This will cost real SOL. Are you sure you want to continue?'
    );
  }, [network]);

  const validateConnection = async (connection: Connection) => {
    try {
      // Test 1: Basic connection check
      const blockhash = await connection.getLatestBlockhash();
      if (!blockhash) throw new Error('Failed to get blockhash');

      // Test 2: Check slot progress
      const slot = await connection.getSlot();
      if (!slot) throw new Error('Failed to get current slot');

      // Test 3: Check recent performance samples
      const perfSamples = await connection.getRecentPerformanceSamples(1);
      if (!perfSamples || perfSamples.length === 0) {
        throw new Error('Failed to get performance samples');
      }

      return true;
    } catch (error) {
      console.error('Connection validation failed:', error);
      return false;
    }
  };

  const handleTokenCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction || !connection) {
      notify({ 
        type: 'error', 
        message: 'Wallet not connected'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Enhanced validation for mainnet
      if (network === WalletAdapterNetwork.Mainnet) {
        const estimatedSize = formData.transferFeeEnabled ? 
          getMintLen([ExtensionType.TransferFeeConfig]) : 
          MINT_SIZE;

        const { isValid, error } = await validateTransactionFeasibility(
          connection,
          publicKey,
          estimatedSize,
          formData.transferFeeEnabled
        );

        if (!isValid) {
          throw new Error(error);
        }
      }

      // Validate inputs with stricter checks
      if (formData.transferFeeEnabled) {
        if (Number(formData.feeBasisPoints) > 10000) {
          throw new Error('Fee basis points cannot exceed 10000 (100%)');
        }
        if (Number(formData.maxFee) > Number(formData.amount)) {
          throw new Error('Maximum fee cannot exceed total supply');
        }
      }

      // Validate inputs
      if (!formData.tokenName || !formData.symbol) {
        throw new Error('Token name and symbol are required');
      }

      const TokenName = formData.tokenName;
      const Symbol = formData.symbol;
      let Amount = Number(formData.amount) || 1000;
      const imageUrl = imagePreview;
      let Decimals = Number(formData.decimals) || 5;

      // Validation checks
      if (TokenName.length > 32) throw new Error('Token name must be 32 characters or less');
      if (Symbol.length > 10) throw new Error('Symbol must be 10 characters or less');
      if (isNaN(Amount) || Amount <= 0) throw new Error('Invalid supply amount');
      if (isNaN(Decimals) || Decimals > 9 || Decimals < 0) throw new Error('Decimals must be between 0 and 9');

      // Upload image and metadata first
      const metadataUri = await uploadImageAndMetadata(
        TokenName,
        Symbol,
        selectedFile,
        imagePreview || generatedImageUrl
      );

      // Generate metadata object
      const metadata = generateMetadata(TokenName, Symbol, imageUrl);

      const mintKeypair = Keypair.generate();
      const withdrawAuthority = formData.withdrawAuthority ? 
        new PublicKey(formData.withdrawAuthority) : 
        publicKey;

      let instructions = [];
      
      if (formData.transferFeeEnabled) {
        // Calculate space with ALL required extensions
        const extensions = [ExtensionType.TransferFeeConfig];
        const mintLen = getMintLen(extensions);
        
        // Get minimum balance for rent exemption
        const mintLamports = await connection.getMinimumBalanceForRentExemption(
          mintLen,
          'confirmed'
        );

        // Create account with proper space allocation
        const createAccountIx = SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports: mintLamports,
          programId: TOKEN_2022_PROGRAM_ID,
        });

        // Initialize transfer fee config
        const initTransferFeeIx = createInitializeTransferFeeConfigInstruction(
          mintKeypair.publicKey,
          publicKey,
          withdrawAuthority,
          Number(formData.feeBasisPoints),
          BigInt(Number(formData.maxFee) * (10 ** Number(formData.decimals))),
          TOKEN_2022_PROGRAM_ID
        );

        // Initialize mint
        const initMintIx = createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(formData.decimals),
          publicKey,
          publicKey,
          TOKEN_2022_PROGRAM_ID
        );

        // Create metadata PDA
        const metadataPDA = getMetadataPDA(mintKeypair.publicKey);

        // Add metadata instruction
        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: TokenName,
                symbol: Symbol,
                uri: metadataUri,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        );

        // Add instructions in correct order
        instructions.push(createAccountIx);
        instructions.push(initTransferFeeIx);
        instructions.push(initMintIx);
        instructions.push(createMetadataInstruction);
      } else {
        // Standard token initialization
        const mintLamports = await connection.getMinimumBalanceForRentExemption(
          MINT_SIZE,
          'confirmed'
        );

        // Create metadata PDA for standard token
        const metadataPDA = getMetadataPDA(mintKeypair.publicKey);

        instructions.push(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: mintLamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            Number(formData.decimals),
            publicKey,
            publicKey,
            TOKEN_PROGRAM_ID
          ),
          createCreateMetadataAccountV3Instruction(
            {
              metadata: metadataPDA,
              mint: mintKeypair.publicKey,
              mintAuthority: publicKey,
              payer: publicKey,
              updateAuthority: publicKey,
            },
            {
              createMetadataAccountArgsV3: {
                data: {
                  name: TokenName,
                  symbol: Symbol,
                  uri: metadataUri,
                  sellerFeeBasisPoints: 0,
                  creators: null,
                  collection: null,
                  uses: null,
                },
                isMutable: true,
                collectionDetails: null,
              },
            }
          )
        );
      }

      // Get associated token account with correct program ID
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
        false,  // isPDA
        formData.transferFeeEnabled ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID // Specify correct program ID
      );

      // Create associated token account with correct program ID
      const createAtaTransaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintKeypair.publicKey,
          formData.transferFeeEnabled ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID // Specify program ID
        )
      );

      // Mint tokens with correct program ID
      const mintToTransaction = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAccount,
          publicKey,
          Amount * Math.pow(10, Decimals),
          [],  // no multisig
          formData.transferFeeEnabled ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID // Specify program ID
        )
      );

      // Get fresh blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

      // Create base transaction
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Add instructions in order
      instructions.forEach(instruction => transaction.add(instruction));
      transaction.add(createAtaTransaction.instructions[0]);
      transaction.add(mintToTransaction.instructions[0]);

      try {
        // Sign with mintKeypair first
        transaction.sign(mintKeypair);

        // Get wallet signature
        const signedTx = await signTransaction(transaction);
        if (!signedTx) throw new Error('Failed to sign transaction');

        // Log transaction details for debugging
        console.log('Transaction details:', {
          numInstructions: transaction.instructions.length,
          signers: [mintKeypair.publicKey.toBase58(), publicKey.toBase58()],
          signatures: transaction.signatures.map(s => ({
            pubkey: s.publicKey.toBase58(),
            signature: s.signature?.toString('base64') || null
          }))
        });

        // Send raw transaction with better error handling
        const rawTx = signedTx.serialize();
        const signature = await connection.sendRawTransaction(rawTx, {
          skipPreflight: true,
          preflightCommitment: 'confirmed',
          maxRetries: 5
        }).catch((error: any) => {
          console.error('SendRawTransaction error:', error);
          if (error.logs) console.error('Transaction logs:', error.logs);
          throw new Error(`Transaction failed: ${error.message}`);
        });

        // Wait for confirmation with timeout
        const confirmation = await Promise.race([
          connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
          }, 'confirmed'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
          )
        ]);

        if (confirmation.value?.err) {
          const errorMsg = typeof confirmation.value.err === 'object' 
            ? JSON.stringify(confirmation.value.err)
            : confirmation.value.err.toString();
          throw new Error(`Transaction failed: ${errorMsg}`);
        }

        setMintAddress(mintKeypair.publicKey.toBase58());
        notify({ 
          type: 'success',
          message: 'Token Created!',
          txid: signature
        });

      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Token creation failed:', error);
      notify({ 
        type: 'error',
        message: 'Token Creation Failed',
        description: getDetailedErrorMessage(error, network)
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Update explorer URL based on network
  const getExplorerUrl = (address: string) => {
    const baseUrl = 'https://explorer.solana.com/address/';
    const networkParam = network === WalletAdapterNetwork.Mainnet ? '' : `?cluster=${network}`;
    return `${baseUrl}${address}${networkParam}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateAIImage = async () => {
    try {
      setIsGeneratingImage(true);
      setLastUsedPrompt(aiPrompt);
      const imageUrl = await generateAIImage(aiPrompt);
      setGeneratedImageUrl(imageUrl);
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!lastUsedPrompt) return;
    try {
      setIsGeneratingImage(true);
      const imageUrl = await generateAIImage(lastUsedPrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-8">
      {/* Title Section */}
      <div className="mb-8 pl-8">
        <h2 className="text-3xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] via-[#9945FF] to-[#DC1FFF]">
            Create Token
          </span>
        </h2>
        <p className="text-gray-400 mt-2">
          Create your custom token with advanced features and AI-generated logo
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-12 gap-6 min-w-[80rem]">
        {/* Token Details - 5 columns */}
        <div className="col-span-4 space-y-4 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
              Token Details
            </span>
          </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Token Name</label>
                  <input
                    type="text"
                    value={formData.tokenName}
                    onChange={(e) => setFormData(prev => ({ ...prev, tokenName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Enter token name"
                  />
                </div>

            <div className="form-group col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                placeholder="e.g. BTC"
              />
            </div>

            <div className="form-group col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Decimals</label>
              <input
                type="number"
                value={formData.decimals}
                onChange={(e) => setFormData(prev => ({ ...prev, decimals: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                placeholder="e.g. 9"
              />
            </div>

            <div className="form-group col-span-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Total Supply</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                placeholder="e.g. 1000000"
              />
            </div>
          </div>

              <div className="border-t border-gray-700/50 pt-4">
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.transferFeeEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, transferFeeEnabled: e.target.checked }))}
                    className="form-checkbox h-4 w-4 text-[#00FFA3] rounded border-gray-700 bg-gray-800/50"
                  />
                  <span className="text-sm font-medium text-gray-400">Enable Transfer Fee</span>
                </label>

                {formData.transferFeeEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group col-span-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Fee Basis Points (1 = 0.01%)
                      </label>
                      <input
                        type="number"
                        value={formData.feeBasisPoints}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          feeBasisPoints: Math.max(0, Math.min(10000, parseInt(e.target.value) || 0))
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                        placeholder="e.g. 100 for 1%"
                        min="0"
                        max="10000"
                      />
                    </div>

                <div className="form-group col-span-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Maximum Fee
                  </label>
                  <input
                    type="text"
                    value={formData.maxFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxFee: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Max fee in tokens"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Withdraw Authority (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.withdrawAuthority}
                    onChange={(e) => setFormData(prev => ({ ...prev, withdrawAuthority: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Solana address"
                  />
                </div>
              </div>
            )}
          </div>

          {!mintAddress && (
            <button
              onClick={handleTokenCreation}
              disabled={isProcessing || !publicKey}
              className="w-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white font-bold py-3 rounded-xl"
            >
              {isProcessing ? 'Creating Token...' : 'Create Token'}
            </button>
          )}
        </div>

        {/* Token Logo - 3 columns */}
        <div className="col-span-3 space-y-4 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
              Token Logo
            </span>
          </h3>

          <div className="relative h-[300px] rounded-xl border-2 border-dashed border-gray-700 hover:border-[#00FFA3] transition-colors group">
            {(imagePreview || generatedImageUrl) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
                <div className="relative w-48 h-48">
                  <img 
                    src={imagePreview || generatedImageUrl}
                    alt="Token Logo" 
                    className="w-full h-full object-contain rounded-lg shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {generatedImageUrl && (
                      <button
                        onClick={handleRegenerateImage}
                        disabled={isGeneratingImage}
                        className="p-2 bg-[#00FFA3] rounded-full text-white hover:scale-110 transition-transform disabled:opacity-50"
                        title="Regenerate Image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setGeneratedImageUrl(null);
                        setSelectedFile(null);
                        setAiPrompt('');
                        setLastUsedPrompt('');
                      }}
                      className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform"
                      title="Remove Image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {isGeneratingImage && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating new version...
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/10 rounded-xl backdrop-blur-sm">
                <div className="p-6 rounded-full bg-gray-800/50 mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Drop image here or use options below<br/>
                  <span className="text-xs text-gray-500">Recommended size: 512x512px</span>
                </p>
              </div>
            )}
          </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-700 bg-gray-800/50 text-white"
                    placeholder="Describe your token logo..."
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleGenerateAIImage}
                    disabled={isGeneratingImage || !aiPrompt}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white rounded-xl"
                  >
                    {isGeneratingImage ? 'Generating...' : 'Generate with AI'}
                  </button>
                  <label
                    htmlFor="logo-upload"
                    className="py-3 px-6 bg-gray-700 text-white rounded-xl cursor-pointer hover:bg-gray-600"
                  >
                    Upload
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

        {/* Token Status - 4 columns */}
        <div className="col-span-3 space-y-4 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
              Token Status
            </span>
          </h3>

          {mintAddress ? (
            <div className="space-y-4">
              <div className="p-3 bg-black/30 rounded-lg">
                <h4 className="text-lg font-semibold text-center text-[#00FFA3] mb-2">
                  Token Created Successfully!
                </h4>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Token Address</label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-[#00FFA3] break-all">{mintAddress}</code>
                    <a
                      href={getExplorerUrl(mintAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <TokenOwnership mintAddress={mintAddress} className="mt-4" />
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Token status and ownership options will appear here after creation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getMetadataPDA = (mint: PublicKey): PublicKey => {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return publicKey;
};
