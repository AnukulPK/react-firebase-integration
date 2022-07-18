import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  const nameInputHandler = (e) => {
    setName(e.target.value);
  };

  const ageInputHandler = (e) => {
    setAge(e.target.value);
  };

  const createUserHandler = async () => {
    await addDoc(usersCollectionRef, {
      name: name,
      age: Number(age),
    });
    alert("Record added successfully");
  };

  const updateUserHandler = async (id, prevAge) => {
    const userDoc = doc(db, "users", id);
    const newFields = {
      age: prevAge + 1,
    };
    await updateDoc(userDoc, newFields);
    alert("Record updated successfully");
  };

  const deleteUserHandler = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    alert("Doc deleted successfully");
  };

  return (
    <div className="App">
      <input placeholder="Name" type="string" onChange={nameInputHandler} />
      <input placeholder="Age" type="number" onChange={ageInputHandler} />
      <button onClick={createUserHandler}>Create User</button>
      <table style={{ width: "100%", margin: "auto", marginTop: "25px" }}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Update Record</th>
            <th>Delete Record</th>
          </tr>

          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td> {user.age}</td>
              <td>
                {" "}
                <button onClick={() => updateUserHandler(user.id, user.age)}>
                  Increase Age
                </button>
              </td>
              <td>
                {" "}
                <button onClick={() => deleteUserHandler(user.id)}>
                  Delete Record
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
