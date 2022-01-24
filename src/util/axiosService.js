import { useState, useEffect } from "react";
import axios from "axios";
const api = "API";

// export default {
//   data() {
//     return {
//       user: `${api}/some/route`,
//       hotels: `${api}/other/route/`
//     }
//   },
//   methods: {
//     getHeaders() {
//       return {
//         headers: {
//           Authorization: 'Bearer ' + 'TOKEN',
//           'Content-Type': 'application/json'
//         }
//       }
//     },
//     getModule(route, cb) {
//       axios
//         .get(route, this.getHeaders())
//         .then(response => {
//           cb(response.data)
//         })
//         .catch(err => {
//           cb(err)
//         })
//     },
//     postModule(route, data, cb) {
//       axios
//         .post(route, data, this.getHeaders())
//         .then(response => {
//           cb(response.data)
//         })
//         .catch(e => {
//           cb(e)
//         })
//     },
//     putModule(route, data, cb) {
//       axios
//         .put(route, data, this.getHeaders())
//         .then(response => {
//           cb(response.data)
//         })
//         .catch(e => {
//           console.log(e)
//         })
//     },
//     deleteModule(route, id, cb) {
//       axios
//         .delete(route + id, this.getHeaders())
//         .then(response => {
//           cb(response.data)
//         })
//         .catch(e => {
//           console.log(e)
//         })
//     }
//   }
// }

// import {​​​​​​ webApi_base_URL }​​​​​​ from "../networks/constants";
const useAxios = () => {
  const [response, setResponce] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const execute = async (param) => {
    try {
      const result = await axios.request(param);
      setResponce(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { execute, loading, error, response };
};
export default useAxios;
