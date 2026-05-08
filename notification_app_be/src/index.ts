import { fetchNotifications } from "./fetchNotifications";
import { getPriorityNotifications } from "./getPriorityNotifications";

const main = async () => {

  try {

    const notifications =
      await fetchNotifications();

    const topNotifications =
      getPriorityNotifications(notifications);

    console.log("\nTop 10 Priority Notifications\n");

    topNotifications.forEach((notification, index) => {

      console.log(
        `${index + 1}. ${notification.Type} - ${notification.Message}`
      );

    });

  } catch (error) {

    console.log(error);

  }
};

main();