
import BackgroundService from "react-native-background-actions";
import BackgroundJob from "react-native-background-actions";
import GeoLocationService from "react-native-geolocation-service";
// import Radar from "react-native-radar";
import radarService from "./radarService";
// import DataManager from "./src/Components/DataManager";

const sleep = (time) =>
    new Promise((resolve) => resolve(saveLocation()));

const saveLocation = () => {
   
   
};
class BService {
    constructor() {
        this.Options = {
            taskName: "FR8",
            taskTitle: "FR8",
            taskDesc: "FR8 tries to get your location",
            taskIcon: {
                name: "ic_launcher",
                type: "mipmap",
            },
            color: "#000",
            parameters: {
                delay: 2000,
            },
            actions: '["Exit"]',
        };
    }
    async VeryIntensiveTask(taskDataArguments) {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            // resolve(saveLocation())
            // for (let i = 0; BackgroundService.isRunning(); i++) {

            await sleep(delay);
            // }
        });
    }
    Start() {
        BackgroundService.start(this.VeryIntensiveTask, this.Options);
    }
    Stop() {
        BackgroundService.stop();
    }
}






const BackgroudService = new BService();
export default BackgroudService;
