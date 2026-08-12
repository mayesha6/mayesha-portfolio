import { Post, IPost } from "./post.model";

const createPost = async (payload: Partial<IPost> & { authorId?: string }) => {
  const postData = { ...payload };
  if (postData.authorId && !postData.author) {
    postData.author = postData.authorId as any;
  }

  const newPost = await Post.create(postData);
  const result = await Post.findById(newPost._id).populate("author", "id name email phone picture");
  return result;
};

const getBlogStats = async () => {
  const aggregatesResult = await Post.aggregate([
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalViews: { $sum: "$views" },
        averageView: { $avg: "$views" },
        minimumView: { $min: "$views" },
        maximumView: { $max: "$views" },
      },
    },
  ]);

  const aggregates = aggregatesResult[0] || {
    totalPosts: 0,
    totalViews: 0,
    averageView: 0,
    minimumView: 0,
    maximumView: 0,
  };

  const featuredCount = await Post.countDocuments({ isFeatured: true });
  const topFeatured = await Post.findOne({ isFeatured: true }).sort({ views: -1 });

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastWeekPostCount = await Post.countDocuments({
    createdAt: { $gte: lastWeek },
  });

  return {
    stats: {
      totalPosts: aggregates.totalPosts ?? 0,
      totalViews: aggregates.totalViews ?? 0,
      averageView: aggregates.averageView ?? 0,
      minimumView: aggregates.minimumView ?? 0,
      maximumView: aggregates.maximumView ?? 0,
    },
    featured: {
      count: featuredCount,
      topFeatured: topFeatured,
    },
    lastWeekPostCount,
  };
};

const getAllPost = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
  sortedBy = "",
  sortedOrder,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
  sortedBy?: string;
  sortedOrder?: string;
}) => {
  const skip = (page - 1) * limit;

  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (typeof isFeatured === "boolean") {
    query.isFeatured = isFeatured;
  }
  if (tags && tags.length > 0) {
    query.tags = { $all: tags };
  }

  const sort: any = {};
  if (sortedBy) {
    sort[sortedBy] = sortedOrder === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  const result = await Post.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("author", "-password");

  const total = await Post.countDocuments(query);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (id: string) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "-password");
  return result;
};

const updatePostById = async (id: string, payload: Partial<IPost>) => {
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePostById = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);
  return result;
};

const getPostByUser = async (userId: string) => {
  const result = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "-password");
  return result;
};

export const PostServices = {
  createPost,
  getAllPost,
  getPostById,
  updatePostById,
  deletePostById,
  getBlogStats,
  getPostByUser,
};
