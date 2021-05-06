import React, { useEffect } from "react";
import { getUsers } from "../../../services/userController";

const initialUsers = [];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(async () => {
    const users = await getUsers(); //falta agregarle el token que tendria que estar en session
    setUsers(users);
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user, index) => {
          return <li key={index}>{user}</li>;
        })}
      </ul>
    </div>
  );
};

export default Users;
