import { FC } from "react";
import Image from "next/image";

export const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 w-full p-2 bg-neutral text-neutral-content bg-black bg-opacity-75 z-50 h-16">
      <div className="max-w-md mx-auto flex flex-row justify-center gap-4 items-center h-full">

        <a
          href="https://github.com/rabbitmomo/SolGPT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z"></path>
          </svg>
        </a>

        <a
          href="https://www.youtube.com/watch?v=3bIYU5kzdnQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
          </svg>
        </a>

        <a
          href="https://twitter.com/Solgpt_Solana"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logoTwitter.png"
            alt="Twitter Logo"
            width={32}
            height={32}
            layout="fixed"
          />
        </a>
      </div>
    </footer>
  );
};
