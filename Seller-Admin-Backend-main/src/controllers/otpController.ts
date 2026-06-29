import { Request, Response, NextFunction } from "express";
import otpGenerator from "otp-generator";
import OTP from "../models/otp.model";
import SellerSchema from "../models/registerSeller.model";
import { mailSender } from "../utils/mailSender";
import fs from "fs";
import path from "path";

export class OtpController {
  static async sendOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      // Check if seller already exists
      const checkUserPresent = await SellerSchema.findOne({ email });
      if (checkUserPresent) {
        res.status(401).json({
          success: false,
          message: "Seller is already registered",
        });
        return;
      }

      // Generate OTP
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // Ensure unique OTP
      let result = await OTP.findOne({ otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({ otp });
      }

      // 🔥 Load HTML template inside function
      const templatePath = path.join(
        __dirname,
        "../utils/otptemplate.html"
      );

      let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

      // Replace OTP
      htmlTemplate = htmlTemplate.replace("{{OTP_CODE}}", otp);

      // Send email (HTML)
      await mailSender(email, "Verify Your Account – OTP", htmlTemplate);

      // Save OTP in DB
      await OTP.create({ email, otp });

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (err: any) {
      console.error("Error sending OTP:", err);

      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  }
}