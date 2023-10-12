const asyncCallQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (asyncCallQueue.length > 0) {
    const asyncCall = asyncCallQueue.shift();
    try {
      await asyncCall!(); // Ensure asyncCall is a function
    } catch (error) {
      console.error("Async call error", error);
    }
  }

  isProcessingQueue = false;
};

export const queueAsyncCall = (asyncFunc: () => Promise<void>) => {
  asyncCallQueue.push(asyncFunc);
  processQueue();
};
