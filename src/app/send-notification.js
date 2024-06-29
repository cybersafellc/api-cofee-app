import { logger } from "./logging.js";

const sendNotification = async (message, number) => {
  try {
    const res = await fetch(
      `https://api.textmebot.com/send.php?recipient=+62${number}&apikey=${process.env.TEXTMEBOT_APIKEY}&text=${message}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const response = await res.json();
    logger.info(response);
    return;
  } catch (error) {
    logger.error(error.message);
    return;
  }
};

export default sendNotification;
