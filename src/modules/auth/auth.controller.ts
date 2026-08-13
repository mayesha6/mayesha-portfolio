import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";

const loginWithEmailAndPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.loginWithEmailAndPassword(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "Logged In successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: err instanceof Error ? err.message : err,
    });
  }
};
const loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.loginWithGoogle(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "Logged In successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      data: result,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.resetPassword(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: err instanceof Error ? err.message : err,
    });
  }
};

export const AuthController = {
    loginWithEmailAndPassword,
    loginWithGoogle,
    forgotPassword,
    resetPassword
}