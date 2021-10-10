import { getLinkPreview } from "link-preview-js";
import { NextApiRequest, NextApiResponse } from "next";




export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // pass the link directly
    const data = await getLinkPreview("https://www.youtube.com/watch?v=MejbOFk7H6c", {
        imagesPropertyType: "og", // fetches only open-graph images
        headers: {
            "user-agent": "googlebot" 
            },
        })
    return res.status(200).json({ data });
}