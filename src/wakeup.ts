import axios from 'axios';

const wakeup = async () => {
    const hostUrl = process.env.HOST_URL;
    if (hostUrl != null) {
        await axios.get(hostUrl);
    }
};

export { wakeup };
