import { S3 } from "aws-sdk";
import { decode } from "base64-arraybuffer";
import { readFile } from "react-native-fs";
import { bucketUrl } from ".";
import { DataManager } from "../Components";
import appsFlyer from "react-native-appsflyer";

export const S3_BUCKETNAME = "fr8.ai-website-dev-content";
const accessKeyId = "AKIA4WINVFQ3BSUKN2UC";
const secretAccessKey = "89Ychh8quxNhM7CE7JfK2bY4FPdNwB/qYgPGOS+J";

///////UDID create//////////////
export const uuidv4_34 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

///// bucket/////////////////
export const s3bucket = new S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  Bucket: S3_BUCKETNAME,
  signatureVersion: "v4",
});

//upload aws file
export const uploadImageOnS3 = async (file, udid, folder, oldFilesArray) => {
  try {
    let obj = await DataManager.getUserDetails().then(async (response) => {
      if (response) {
        let splitPath = file.uri.split("/");
        let parseData = await JSON.parse(response);
        const extent =
          file && file.name
            ? file.name.split(".")
            : splitPath[splitPath.length - 1];
        const extentT = extent && extent[extent.length - 1];
        let contentType = file.type;
        let contentDeposition = 'inline;filename="' + file.name + '"';
        const base64 = await readFile(file.uri, "base64");
        const arrayBuffer = decode(base64);
        return {
          Bucket: S3_BUCKETNAME,
          Key: `application/${
            parseData?.data?._id
          }/${folder}/${udid}.${extentT}`,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType,
          oldFilesArray: oldFilesArray,
        };
      }
      return null;
    });
    let newObj = null;
    if (!obj) {
      newObj = await DataManager.getDummyUserDetails().then(
        async (response) => {
          if (response) {
            let splitPath = file.uri.split("/");
            console.log(
              response.data.userId,
              "::::::::::::response",
              splitPath
            );
            const extent =
              file && file.name
                ? file.name.split(".")
                : splitPath[splitPath.length - 1];
            const extentT = extent && extent[extent.length - 1];
            let contentType = file.type;
            let contentDeposition = 'inline;filename="' + file.name + '"';
            const base64 = await readFile(file.uri, "base64");
            const arrayBuffer = decode(base64);
            return {
              Bucket: S3_BUCKETNAME,
              Key: `application/${
                response?.data?.userId
              }/${folder}/${udid}.${extentT}`,
              Body: arrayBuffer,
              ContentDisposition: contentDeposition,
              ContentType: contentType,
              oldFilesArray: oldFilesArray,
            };
          }
          return null;
        }
      );
    }
    console.log(":::::::::::;obj", obj, newObj);
    return obj ? obj : newObj;
  } catch (error) {
    console.log(":::::::::aaa", err);
  }
};

//aflogevent for google analytics
export const AFLogEvent = async (name, values) => {
  let obj = DataManager.getUserDetails().then(async (response) => {
    if (response) {
      let parseData = await JSON.parse(response);
      if (parseData) {
        let id = parseData?.data?._id;
        values.user_id = id;
        appsFlyer.logEvent(
          name,
          values,
          (res) => {
            console.log("success", res, values);
          },
          (err) => {
            console.log("errAFLog", err);
          }
        );
      } else {
        appsFlyer.logEvent(
          name,
          values,
          (res) => {
            console.log("success", res, values);
          },
          (err) => {
            console.log("errAFLog", err);
          }
        );
      }
    } else {
      appsFlyer.logEvent(
        name,
        values,
        (res) => {
          console.log("success", res, values);
        },
        (err) => {
          console.log("errAFLog", err);
        }
      );
    }
  });
  return obj;
};

//delete aws file
export const deleteFile = async (url) => {
  let text = "ddd";

  url.map((x) => {
    console.log("deleted file", x);
    s3bucket.deleteObject(
      {
        Bucket: S3_BUCKETNAME,
        Key: x?.url ? x.url.replace(bucketUrl, "") : x.replace(bucketUrl, ""),
      },
      (err, data) => {
        if (err) {
        }

        if (data) {
          console.log("dattatataa", data);
        }
      }
    );
  });
};
