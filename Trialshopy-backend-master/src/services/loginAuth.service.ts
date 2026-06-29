import twilio from "twilio";
import OTP from "../models/otp.model";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioFromNumber = process.env.TWILIO_FROM_NUMBER!;
const twilioClient = twilio(accountSid, authToken);

export class authService {
  static async sendOTP(mobileNumber: string): Promise<void> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      // Check if an OTP already exists for the given mobile number
      const existingOTP = await OTP.findOne({ mobileNumber });

      // If OTP exists, delete it
      if (existingOTP) {
        await OTP.deleteMany({ mobileNumber });
      }

      // Send SMS OTP using Twilio
      try {
        const formattedMobileNumber = mobileNumber.startsWith("+91") ? mobileNumber : "+91" + mobileNumber;
        await twilioClient.messages.create({
          body: `Your OTP is: ${otp}`,
          from: twilioFromNumber,
          to: formattedMobileNumber,
        });
      } catch (twilioError) {
        console.warn("Twilio failed to send SMS, but OTP is generated: " + twilioError.message);
      }
      
      console.log(`\n=================================================`);
      console.log(`YOUR OTP FOR MOBILE NUMBER ${mobileNumber} IS: ${otp}`);
      console.log(`=================================================\n`);

      // Create new OTP record
      const otpPayload = { mobileNumber, otp };
      await OTP.create(otpPayload);
    } catch (error) {
      console.error("Error creating OTP: ", error);
      throw new Error("Failed to send OTP");
    }
  }

  static async verifyOTP(mobileNumber: string, otp: string): Promise<{ success: boolean }> {
    try {
      // Find the OTP record for the provided mobile number
      const otpRecord = await OTP.findOne({ mobileNumber });

      // Check if the OTP exists and matches
      if (!otpRecord || otpRecord.otp !== otp) {
        return { success: false };
      }

      // OTP is valid, delete the record after successful verification
      await OTP.deleteOne({ mobileNumber });

      return { success: true };
    } catch (error) {
      throw new Error("Failed to verify OTP");
    }
  }
}
