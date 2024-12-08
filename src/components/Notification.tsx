import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import useNotificationStore from '../stores/useNotificationStore';
import { useConnection } from '@solana/wallet-adapter-react';
import Image from 'next/image';

const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore((s) => s);

  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const reversedNotifications = [...notifications].reverse();

  useEffect(() => {
    if (reversedNotifications.length > 0) {
      const timeoutDuration = 8000; 

      const id = setTimeout(() => {
        setCurrentNotificationIndex((prevIndex) => {
          if (prevIndex < reversedNotifications.length - 1) {
            return prevIndex + 1; 
          }
          return prevIndex; 
        });
      }, timeoutDuration);

      return () => clearTimeout(id);
    }
  }, [currentNotificationIndex, reversedNotifications]);

  const currentNotification = reversedNotifications[currentNotificationIndex];

  return (
    <div className={`z-20 fixed m-auto inset-0 flex items-start justify-center px-4 py-6 pointer-events-none sm:p-6 mt-8`}>
      <div className={`flex flex-col w-full`}>
        {currentNotification && (
          <Notification
            key={`${currentNotification.message}${currentNotificationIndex}`}
            type={currentNotification.type}
            message={currentNotification.message}
            description={currentNotification.description}
            txid={currentNotification.txid}
            onHide={() => {
              setNotificationStore((state) => {
                state.notifications = state.notifications.filter((_, idx) => idx !== reversedNotifications.length - 1 - currentNotificationIndex);
              });
              setCurrentNotificationIndex(0); // Reset to the first notification
            }}
          />
        )}
      </div>
    </div>
  );
};

const Notification = ({ type, message, description, txid, onHide }) => {
  const { connection } = useConnection();

  return (
    <div
      className={`max-w-lg w-full bg-white shadow-lg rounded-md mt-2 pointer-events-auto ring-1 ring-black ring-opacity-5 p-2 mx-auto mt-16 overflow-hidden opacity-70`}
    >
      <div className={`p-4`}>
        <div className={`flex items-center text-center`}>
          <div className={`flex-shrink-0`}>
            {type === 'success' ? (
              <Image
                src="/ok.png"
                alt="Success"
                width={32}
                height={32}
                layout="fixed"
              />
            ) : null}
            {type === 'info' && <InformationCircleIcon className={`h-8 w-8 mr-1 text-blue-700`} />}
            {type === 'error' && (
              <Image
                src="/bug.png"
                alt="error"
                width={32}
                height={32}
                layout="fixed"
              />
            )}
          </div>
          <div className={`ml-2 w-0 flex-1`}>
            <div className={`font-bold text-black`}>{message}</div>
            {description ? (
              <p className={`mt-0.5 text-sm text-black`}>{description}</p>
            ) : null}
            {txid ? (
              <div className="flex flex-row">
                <a
                  href={'https://explorer.solana.com/tx/' + txid + `?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row link link-accent"
                >
                  <svg className="flex-shrink-0 h-4 ml-2 mt-0.5 text-primary-light w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  <div className="flex mx-4">{txid.slice(0, 8)}...
                    {txid.slice(txid.length - 8)}
                  </div>
                </a>
              </div>
            ) : null}
          </div>
          <div className={`ml-4 flex-shrink-0 self-start flex`}>
            <button
              onClick={() => {
                onHide();
              }}
              className={`bg-bkg-2 default-transition rounded-md inline-flex text-fgd-3 hover:text-fgd-4 focus:outline-none`}
            >
              <span className={`sr-only`}>Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
