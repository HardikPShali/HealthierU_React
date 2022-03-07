import axios from 'axios';
import LocalStorageService from '../util/LocalStorageService';
//import { checkAccessToken } from './RefreshTokenService';
export const getWorkouts = async () => {

    var config = {
        method: 'get',
        url: `/api/admin/workouts`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };

    return await axios(config).then(response => {
        //console.log(response.data)
        return response.data;
    })

}
export const deleteWorkout = async (id) => {
    var config = {
        method: 'delete',
        mode: 'no-cors',
        url: `/api/admin/workouts/${id}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    const response = await axios(config).then(res => {
        if (res) {
            return res;
        }
    });
    return response;
}


export const getWorkoutVideos = async (patientId) => {

    const workoutApiCall = {
        method: 'get',
        url: `/api/admin/workouts?published.equals=true&patientId=${patientId}&page=0&size=18`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    return await axios(workoutApiCall).then(workoutVideos => {
        return workoutVideos.data;
    })
    // .catch(error => {
    //     if (error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })    
}

export const createLikedWorkout = (likedData) => {
    
    var payload = {
        method: 'post',
        mode: 'no-cors',
        data: likedData,
        url: `/api/like-logs`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return axios(payload).then(response => {
        // //console.log(response.status);
        if (response.status === 200 || response.status === 201) {
            return true;
        }
    })
    // .catch(error => {
    //     if (error.response && error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })
}

export const removeLikedWorkout = (likedId) => {
    
    var payload = {
        method: 'delete',
        mode: 'no-cors',
        url: `/api/like-logs/${likedId}`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
    return axios(payload).then(response => {
        // //console.log(response.status);
        if (response.status === 200 || response.status === 204) {
            return true;
        }
    })
    // .catch(error => {
    //     if (error.response && error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })
}

export const getLikedWorkoutVideos = async (patientId) => {

    const workoutApiCall = {
        method: 'get',
        url: `/api/like-logs?type=WORKOUT&patientId.equals=${patientId}&page=0`,
        headers: {
            'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
            'Content-Type': 'application/json'
        }
    };
    return await axios(workoutApiCall).then(workoutVideos => {
        return workoutVideos.data;
    })
    // .catch(error => {
    //     if (error.response.status === 401) {
    //         checkAccessToken();
    //     }
    // })    
}