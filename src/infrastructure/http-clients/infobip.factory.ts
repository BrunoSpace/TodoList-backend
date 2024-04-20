interface InfobipSmsMessage {
  messages: {
    destinations: { to: string }[];
    from: string;
    text: string;
  }[];
}

export class InfobipFactory {
  public static createInfobipSmsMessage(
    to: string,
    message: string,
  ): InfobipSmsMessage {
    return {
      messages: [
        {
          destinations: [
            {
              to,
            },
          ],
          from: process.env.INFOBIP_SENDER,
          text: message,
        },
      ],
    };
  }
}
