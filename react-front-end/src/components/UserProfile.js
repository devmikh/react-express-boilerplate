import React from "react";

export default function UserProfile(props) {
  return (
    <div style={{ fontSize: "40px", textAlign: "center" }}>
      <i class="fa fa-user-circle-o fa-5x" aria-hidden="true"></i>
      <p>Name: {props.userData.username}</p>
      <p>Email: example@example.com</p>
      <p>Phone: 111-111-1111</p>
    </div>
  );
}
