import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url = req.query.image_url;

    if (!image_url) {
      console.error("====================================");
      console.error("image_url is required");
      console.error("====================================");
      return res.status(400).send({ message: "image_url is required" });
    }

    let result_image: string = null;

    try {
      result_image = await filterImageFromURL(image_url);
    } catch (error) {
      console.error("====================================");
      console.error(error);
      console.error("====================================");
      return res.status(400).send({ message: "can not filter image from url" });
    }

    if (!result_image) {
      console.error("====================================");
      console.error("image is not found");
      console.error("====================================");
      return res.status(400).send({ message: "image is not found" });
    }

    return res.status(200).sendFile(result_image, () => {
      deleteLocalFiles([result_image]);
    });
  });

  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
