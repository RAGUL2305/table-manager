import React from "react";
import { useFormContext } from "./TableProvider";
import "./table.css";
import _ from "lodash";

interface Data {
  data: string[];
}

function TableManager(props: Data) {
  let { data } = props;

  const {
    selectedOptions,
    formData,
    values,
    checkedItems,
    view,
    selectedData,
    inputRef,
    drop,
    handleChange,
    handleInputChange,
    handleSubmit,
    handleDeleteClick,
    handleCheckboxChange,
    handleCheckedRemoveClick,
    handleNoClick,
    handleDropClick,
    setView,
  } = useFormContext();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table border={1}>
          <thead>
            <tr>
              <th></th> <th>Id</th> <th>Name</th> <th>Description</th>
              <th>link</th> <th>Shouldcook</th>
              <th>Nutritions</th> <th>Max.intake per Day</th> <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {values.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item)}
                    checked={checkedItems.includes(item.id)}
                  />
                </td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.link}</td>
                <td>{item.shouldcook}</td>
                <td>{item.nutritions}</td>
                <td>{item.maxintakeperday}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="but"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td>{formData.id}</td>
              <td>
                <input
                  ref={inputRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  // required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter your Description"
                  // required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Enter your Description"
                  // required
                />
              </td>
              <td>
                <input
                  type="radio"
                  name="shouldcook"
                  value="Yes"
                  checked={formData.shouldcook === "Yes"}
                  onChange={handleChange}
                  // required
                />
                Yes
                <input
                  type="radio"
                  name="shouldcook"
                  value="No"
                  checked={formData.shouldcook === "No"}
                  onChange={handleChange}
                />
                No
              </td>
              <td>
                <input
                  value={selectedOptions}
                  onChange={handleChange}
                  onClick={handleDropClick}
                />
                
                {drop &&<div className="drop">
                  {data.map((item, index) => (
                    <div >
                      <input
                        type="checkbox"
                        key={index}
                        onChange={() =>handleInputChange(item)}
                        checked={selectedOptions.includes(item)}
                      />
                     {item}
                    </div>
                  ))}</div>}
                  
              </td>
              <td>
                <input
                  type="text"
                  name="maxintakeperday"
                  value={formData.maxintakeperday}
                  onChange={handleChange}
                  placeholder="Enter your Description"
                  // required
                />
              </td>
              <td>
                <button type="submit" className="but">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className="options">
        <button onClick={() => setView("details")}>Details</button>
        <button onClick={() => setView("log")}>Log</button>
        <button onClick={() => setView("delete")}>Delete</button>
      </div>
      <div>
        {view === "details" && selectedData.length !== 0 && (
          <div>
            <h3>Details for : {selectedData[0].name}</h3>
            <p>{selectedData[0].description}</p>
            <p>It is used to cook:{selectedData[0].shouldcook}</p>
            <p>Nutritions : {selectedData[0].nutritions}</p>
            <p>We should take {selectedData[0].maxintakeperday} per day</p>
            <a href={selectedData[0].link}>
              <button>Learn More</button>
            </a>
          </div>
        )}
      </div>
      <div>
        {view === "log" && selectedData.length !== 0 && (
          <div>SEE THE CONSOLE</div>
        )}
      </div>
      <div>
        {view === "delete" && selectedData.length !== 0 && (
          <div>
            Do you want to delete all selectedItems?
            <div>
              <button onClick={handleCheckedRemoveClick}>Yes</button>
              <button onClick={handleNoClick}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableManager;
