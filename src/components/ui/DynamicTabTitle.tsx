import React, { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';

const AWAY_MESSAGES = [
  '👀 Come back! | CELestia',
  '✨ We miss you! 💖',
  '🎁 10% Off is waiting for you! ⚡',
  '💎 Your curated bag misses you!',
  '💍 Handcrafted in Mumbai • CELestia'
];

export const DynamicTabTitle: React.FC = () => {
  const { cart, totalItems } = useCart();
  const originalTitleRef = useRef<string>(document.title || 'CELestia — Redefined For All | Fine Jewellery');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Keep record of original title
    if (document.title && !document.title.includes('Come back') && !document.title.includes('We miss you')) {
      originalTitleRef.current = document.title;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched to another tab
        let messageIndex = 0;

        const dynamicAwayList = totalItems > 0
          ? [
              `👀 (${totalItems}) items in your bag!`,
              '✨ We miss you! 💖',
              '🎁 Use code CELESTIA10 for 10% off',
              '💎 Don\'t leave your jewels behind!',
              '👀 Come back! | CELestia'
            ]
          : AWAY_MESSAGES;

        // Immediately show first away message
        document.title = dynamicAwayList[0];

        // Swap messages every 2.2 seconds
        intervalRef.current = window.setInterval(() => {
          messageIndex = (messageIndex + 1) % dynamicAwayList.length;
          document.title = dynamicAwayList[messageIndex];
        }, 2200);

      } else {
        // User came back to the tab!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Welcome back flash message
        document.title = '✨ Welcome back! 💎';
        const timeoutId = setTimeout(() => {
          document.title = originalTitleRef.current;
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalItems]);

  return null;
};

export default DynamicTabTitle;
