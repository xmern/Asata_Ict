import { fileDisplay } from "./fileDisplay";
import { folderDisplay } from "./folderDisplay";

export interface fileTable{
    folders:folderDisplay[],
    files:fileDisplay[],
}