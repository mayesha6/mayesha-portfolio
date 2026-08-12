import { User, IUser } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  console.log({ payload });
  const result = await User.create(payload);
  return result;
};

const getAllUser = async () => {
  const result = await User.find()
    .select("-password")
    .populate("posts")
    .sort({ createdAt: -1 });
  return result;
};

const getUserById = async (id: string) => {
  const result = await User.findById(id)
    .select("-password")
    .populate("posts");
  return result;
};

const updateUserById = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true })
    .select("-password")
    .populate("posts");
  return result;
};

const deleteUserById = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
};