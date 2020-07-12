import { useState, useEffect } from "react";
import axios from "axios";
// import { getAppointmentsForDay } from "helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    // Initialize application state
    tab: "Warranties",
    userData: {},
    tabs: ["Warranties", "Monthly Payments", "Transactions", "User Profile"],
    warranties: [],
    payments: [],
    transactions: [],
    currentItem: null,
    renderForm: false,
    renderEditForm: false,
  });

  const setTab = (tab) => setState({ ...state, tab }); // Set tab with a tab string
  const setCurrentItem = (currentItem) => setState({ ...state, currentItem });
  const setWarranties = (warranties) => setState({ ...state, warranties });
  const setRenderForm = (renderForm) => setState({ ...state, renderForm });
  const setRenderEditForm = (renderEditForm) =>
    setState({ ...state, renderEditForm });

  const onFileUpload = (fileObj, itemId) => {
    // for (let key in files) {
    //   if (files[key] instanceof File) {
    //     // Create an object of formData
    //     const formData = new FormData();

    //     // Update the formData object
    //     formData.append("file", files[key]);

    //     // Details of the uploaded file
    //     // console.log("in upload", fileObj);

    //     // Request made to the backend api
    //     // Send formData object
    //     return axios.post(`api/uploadfile/${itemId}`, formData);
    //   }
    // }

    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", fileObj);

    // Details of the uploaded file
    console.log("in upload", fileObj);

    // Request made to the backend api
    // Send formData object
    return axios.post(`api/uploadfile/${itemId}`, formData);
  };

  function addItem(inputObj) {
    console.log(inputObj);

    return axios.post(`/api/items`, inputObj).then((response) => {
      console.log(inputObj.files);
      for (let key in inputObj.files) {
        if (inputObj.files[key] instanceof File) {
          onFileUpload(inputObj.files[key], response.data);
        }
      }

      populateState();
    });
  }
  function updateItem(inputObj) {
    // console.log(state.currentItem);

    return axios
      .post(`/api/items/${state.currentItem.id}`, inputObj)
      .then((response) => {
        for (let key in inputObj.files) {
          if (inputObj.files[key] instanceof File) {
            onFileUpload(inputObj.files[key], response.data).then(() => {
              fetchItemDetails(response.data, false);
            });
          }
        }
        fetchItemDetails(state.currentItem.id, false);
      });
  }

  // const fetchItemDetails = (id) => {
  //   return axios.get(`/api/items/${id}`).then((response) => {
  //     // console.log("inside fetchitemdetails", response.data);
  //     setCurrentItem(response.data);
  //   });
  // };

  const fetchItemDetails = (id, renderEditForm) => {
    return axios.get(`/api/items/${id}`).then((response) => {
      console.log("inside fetchitemdetails", response.data);
      // setCurrentItem(response.data);

      setState({ ...state, currentItem: response.data, renderEditForm });
    });
  };

  const deleteFile = (id) => {
    console.log("in deleteFile");

    return axios.post(`/api/files/${id}/delete`);
  };

  const populateState = () => {
    // console.log("INSIDE populate()");
    Promise.all([
      axios.get("/api/users/1"),
      axios.get("/api/warranties"),
      axios.get("/api/payments"),
      axios.get("/api/transactions"),
    ]).then(([response, response2, response3, response4]) => {
      // console.log("INSIDE pop", response2.data);

      setState((prev) => ({
        ...prev,
        userData: response.data,
        warranties: response2.data,
        payments: response3.data,
        transactions: response4.data,
      }));
    });
  };

  // Initialize state with database data
  useEffect(() => {
    populateState();
  }, [state.currentItem]);

  // useEffect(() => {
  //   fetchItemDetails();
  // }, [state.renderEditForm]);

  return {
    state,
    setTab,
    setCurrentItem,
    setState,
    setWarranties,
    setRenderForm,
    addItem,
    setRenderEditForm,
    fetchItemDetails,
    deleteFile,
    updateItem,
  };
}
