import React, { Component, useState } from "react";
import LocalStorageService from "../util/LocalStorageService";
import axios from "axios";

export const getAvailTimeSlot = async (data) => {
  var payload = {
    method: "post",
    url: "/api/v2/appointments/recur/doctor",
    data: data,
    headers: {
      Authorization: "Bearer " + LocalStorageService.getAccessToken(),
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await axios(payload).then((res)=>{
    if(res){
        return res;
    }
  })
  return response;
};
