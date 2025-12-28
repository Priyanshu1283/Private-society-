import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

export default function Me() {
  const [editingPic, setEditingPic] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [form, setForm] = useState({
    name: "John Doe",
    houseNo: "123",
    email: "john@example.com",
    password: "",
    confirmPassword: "",
  });
  const [initialForm, setInitialForm] = useState(form);
  const [profilePic, setProfilePic] = useState("https://placehold.co/600x400");
  const [previewPic, setPreviewPic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewPic(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleSavePic = async () => {
    if (!selectedFile) return;
    try {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);
      
        const token = localStorage.getItem("token");
      
        const response = await fetch("http://localhost:3000/api/me/profile-picture", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      
        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }
        const data = await response.json();
        setProfilePic(`${data.profilePictureUrl}?t=${Date.now()}`); // Append a timestamp to prevent caching
      
        //      setPreviewPic(null);    ISKE SATH IT DIDNT SHOW IMAGE UNTIL RELOAD...
        setSelectedFile(null);
        setEditingPic(false);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
      
  };

  const handleEditDetails = () => {
    setInitialForm(form);
    setEditingDetails(true);
    setForm({ ...form, password: "", confirmPassword: "" });
  };

  const toggleEditing = () => {
    setEditingPic(!editingPic);
  };

  const validateForm = () => {
    if (editingDetails) {
      if (!form.name || !form.houseNo || !form.email) {
        alert("All fields are required");
        return false;
      }

      if (form.password !== "" && form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSaveDetails = async () => {
    if (!validateForm()) return;

    try {
      const updatedFields = {};

      if (form.password && form.password !== "********" && form.password !== initialForm.password) {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        updatedFields.password = form.password;
      }

      for (const key in form) {
        if (key !== "password" && key !== "confirmPassword" && form[key] !== initialForm[key]) {
          updatedFields[key] = form[key];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        setEditingDetails(false);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (updatedFields.password) updatedFields.password = "********";

      setForm((prev) => ({
        ...prev,
        ...updatedFields,
        confirmPassword: "",
      }));
      setInitialForm((prev) => ({
        ...prev,
        ...updatedFields,
        confirmPassword: "",
      }));
      setEditingDetails(false);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        ...updatedFields,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (error) {
      console.error("Failed to save details:", error.message);
      alert(error.message);
    }
  };
  const handleDiscardChanges = () => {
    setForm({ ...initialForm, confirmPassword: "" });
    setEditingDetails(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const adminData = localStorage.getItem('admin');
    const workerData = localStorage.getItem('worker');
  
    if (token && (storedUser || adminData || workerData)) {
      const userObj = storedUser ? JSON.parse(storedUser) : adminData ? JSON.parse(adminData) : JSON.parse(workerData);
      setUser(userObj);
      setForm({
        name: userObj.name || "John Doe",
        houseNo: userObj.houseNo || "123",
        email: userObj.email || "john@example.com",
        password: "********",
        confirmPassword: "",
      });
      setInitialForm({
        name: userObj.name || "John Doe",
        houseNo: userObj.houseNo || "123",
        email: userObj.email || "john@example.com",
        password: "********",
        confirmPassword: "",
      });
  
      const fetchAndSetProfilePic = async (userId) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/me/profile-picture/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch profile picture");
      
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setProfilePic(objectUrl);
        } catch (err) {
          console.error("Error fetching profile picture:", err);
          setProfilePic("https://via.placeholder.com/120");
        }
      };
  
      fetchAndSetProfilePic(userObj.id);
    }
  }, []);
  

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-12 px-3">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-xl text-center font-semibold tracking-wide underline shadow-lg mb-4">Manage Your Information</h1>
          <div className="relative">
            <img
              src={previewPic || profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              onClick={toggleEditing}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
            >
              <Pencil size={16} />
            </button>
          </div>

          {editingPic && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              {previewPic ? (
                <div className="mt-4 flex gap-3">
                  <button
                    className="px-4 py-1 text-sm bg-gray-300 rounded-full hover:bg-gray-400"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Reupload
                  </button>
                  <button
                    className="px-4 py-1 text-sm bg-green-600 text-white rounded-full hover:bg-green-700"
                    onClick={handleSavePic}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="mt-4 px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload New Photo
                </button>
              )}
            </>
          )}
        </div>

        <div className="mt-10 space-y-4">
          {["name", "houseNo", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-700 capitalize mb-1">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled={!editingDetails}
                className={`w-full px-4 py-2 rounded-xl border ${
                  editingDetails
                    ? "border-blue-400 focus:outline-blue-500"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>
          ))}

          {editingDetails && (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-blue-400 focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-blue-400 focus:outline-blue-500"
                />
              </div>
            </>
          )}

          {editingDetails ? (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleDiscardChanges}
                className="px-6 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600"
              >
                Discard
              </button>
              <button
                onClick={handleSaveDetails}
                className="px-6 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Details
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditDetails}
              className="px-6 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
