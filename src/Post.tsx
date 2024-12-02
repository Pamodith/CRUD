import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/posts";

type Post = {
  id: number;
  title: string;
  content: string;
};

const Posts: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [post, setPost] = useState({ title: "", content: "" });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (post.title.trim() && post.content.trim()) {
      axios
        .post(API_URL, post)
        .then(() => {
          setPost({ title: "", content: "" });
          getPost();
        })
        .catch((error) => console.error("Error creating post:", error));
    } else {
      alert("Both fields are required.");
    }
  };

  const getPost = () => {
    axios
      .get(API_URL)
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const update = (id: number) => {
    axios
      .put(`${API_URL}/${id}`, post)
      .then(() => getPost())
      .catch((error) => console.error("Error updating post:", error));
  };

  const remove = (id: number) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => getPost())
      .catch((error) => console.error("Error deleting post:", error));
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <h1>CRUD Posts</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleInput}
          placeholder="Enter title"
        />
        <input
          type="text"
          name="content"
          value={post.content}
          onChange={handleInput}
          placeholder="Enter content"
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {data.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          data.map((item) => (
            <li key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
              <button onClick={() => update(item.id)}>Update</button>
              <button onClick={() => remove(item.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Posts;
