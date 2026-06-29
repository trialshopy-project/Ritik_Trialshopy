import { NextFunction, Request, Response } from "express";
import twilio from "twilio";

export class TestOtpController {
  static async testOtpDelivery(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      res.status(400).json({ message: "Mobile number is required" });
      return;
    }

    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID!;
      const authToken = process.env.TWILIO_AUTH_TOKEN!;
      const twilioFromNumber = process.env.TWILIO_FROM_NUMBER!;
      const twilioClient = twilio(accountSid, authToken);

      const formattedMobileNumber = mobileNumber.startsWith("+91") ? mobileNumber : "+91" + mobileNumber;
      
      const response = await twilioClient.messages.create({
        body: `Test OTP Delivery from Trialshopy`,
        from: twilioFromNumber,
        to: formattedMobileNumber,
      });

      res.status(200).json({ 
        success: true, 
        message: "SMS request triggered successfully",
        twilioResponse: response
      });
    } catch (error: any) {
      console.error("Test OTP Delivery Error: ", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to trigger SMS",
        errorDetails: {
          message: error.message,
          code: error.code,
          status: error.status
        }
      });
    }
  }
}
