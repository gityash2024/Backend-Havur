import { model } from "mongoose";
import { folderSchema } from "../../../models/folderOfPatient";

export const Folders = model("Folders", folderSchema);
