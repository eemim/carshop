import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Addcar from "./Addcar";
import Editcar from "./Editcar";

export default function Carlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch("https://carrestapi.herokuapp.com/cars")
      .then((response) => response.json())
      .then((responseData) => setCars(responseData._embedded.cars))
      .catch((err) => console.error(err));
  };

  const saveCar = (car) => {
    fetch("https://carrestapi.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((res) => fetchData())
      .catch((err) => console.error(err));
  };

  const deleteCar = (params) => {
    if (window.confirm("Ookko nää varma?")) {
      fetch(params, { method: "DELETE" })
        .then((res) => fetchData())
        .catch((err) => console.error(err));
    }
  };

  const updateCar = (car, params) => {
    fetch(params, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((res) => fetchData())
      .catch((err) => console.error(err));
  };

  const columnDefs = [
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true },
    { field: "fuel", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true },
    { field: "price", sortable: true, filter: true },
    {
      width: 100,
      cellRenderer: (params) => (
        <Editcar updateCar={updateCar} car={params.data} />
      ),
    },

    {
      width: 100,
      cellRenderer: (params) => (
        <Button
          onClick={() => deleteCar(params.data._links.self.href)}
          variant="contained"
          color="error"
          size="small"
        >
          DELETE
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Addcar saveCar={saveCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "100%", margin: "auto" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={cars}
          pagination={true}
          // tähän väliin lisätään sivutus
        ></AgGridReact>
      </div>
    </div>
  );
}
