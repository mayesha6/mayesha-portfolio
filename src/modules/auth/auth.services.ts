import { User, IUser } from "../user/user.model";

const loginWithEmailAndPassword = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (password === user.password) {
    return user;
  } else {
    throw new Error("Password does not match.");
  }
};

const loginWithGoogle = async (data: Partial<IUser>) => {
  let user = await User.findOne({ email: data.email });

  if (!user) {
    user = await User.create(data);
  }

  return user;
};

export const AuthServices = {
  loginWithEmailAndPassword,
  loginWithGoogle,
};