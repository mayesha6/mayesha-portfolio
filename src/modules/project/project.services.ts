import { Project, IProject } from "./project.model";

const createProject = async (payload: Partial<IProject>) => {
  const createProject = await Project.create(payload);
  return createProject;
};

const getAllProject = async ({
  page = 1,
  limit = 10,
  search,
  techStack,
  sortedBy = "",
  sortedOrder,
}: {
  page?: number;
  limit?: number;
  search?: string;
  techStack?: string[];
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
  if (techStack && techStack.length > 0) {
    query.techStack = { $all: techStack };
  }

  const sort: any = {};
  if (sortedBy) {
    sort[sortedBy] = sortedOrder === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  const result = await Project.find(query).sort(sort).skip(skip).limit(limit);
  const total = await Project.countDocuments(query);

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

const getProjectById = async (id: string) => {
  const result = await Project.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
  return result;
};

const updateProjectById = async (id: string, payload: Partial<IProject>) => {
  const result = await Project.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteProjectById = async (id: string) => {
  const result = await Project.findByIdAndDelete(id);
  return result;
};

export const ProjectServices = {
  createProject,
  getAllProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
