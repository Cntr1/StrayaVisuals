// src/components/VideoDashboard.jsx
import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import styles from "../AdminDashboard.module.css"
 // adjust the path as needed


const VideoDashboard = () => {
  // Define four upload sections (one per video slot)
  const [uploadSections, setUploadSections] = useState([
    { slot: 1, title: "", file: null, thumbnail: "" },
    { slot: 2, title: "", file: null, thumbnail: "" },
    { slot: 3, title: "", file: null, thumbnail: "" },
    { slot: 4, title: "", file: null, thumbnail: "" },
  ]);
  const [videos, setVideos] = useState([]);

  // Fetch videos from Firestore in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
      const videoList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videoList);
    });
    return () => unsubscribe();
  }, []);

  // Handle file input change for a given section
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSections = [...uploadSections];
      updatedSections[index].file = file;
      setUploadSections(updatedSections);
    }
  };

  // Handle text input changes (title and thumbnail) for a section
  const handleSectionChange = (e, index, field) => {
    const updatedSections = [...uploadSections];
    updatedSections[index][field] = e.target.value;
    setUploadSections(updatedSections);
  };

  // Upload function using Firebase Storage and Firestore
  const handleUpload = async (index) => {
    const section = uploadSections[index];
    if (!section.title || !section.file) {
      alert("Please fill in the title and select a video file.");
      return;
    }

    try {
      // Create a Storage reference (store files under "videos/" with slot number and original file name)
      const storageRef = ref(storage, `videos/slot_${section.slot}_${section.file.name}`);
      
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, section.file);
      
      // Retrieve the download URL of the uploaded video
      const videoUrl = await getDownloadURL(storageRef);
      
      // Save (or update) the video metadata in Firestore
      await setDoc(doc(db, "videos", String(section.slot)), {
        slot: section.slot,
        title: section.title,
        videoUrl,
        thumbnail: section.thumbnail,
        createdAt: new Date()
      });
      
      alert("Video uploaded successfully!");

      // Reset the form for that section
      const updatedSections = [...uploadSections];
      updatedSections[index] = { slot: section.slot, title: "", file: null, thumbnail: "" };
      setUploadSections(updatedSections);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Video Dashboard</h2>
      <button
                    onClick={() => navigate("/admin")}
                    className={`${styles.button} ${styles.blue}`}
                  >
                    Admin Dashboard
                  </button>
      
      {/* Upload Sections */}
      <div className="row">
        {uploadSections.map((section, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">Upload Section {section.slot}</h5>
              <div className="mb-3">
                <label className="form-label">Video Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter video title"
                  value={section.title}
                  onChange={(e) => handleSectionChange(e, index, "title")}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Video</label>
                <input
                  type="file"
                  className="form-control"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, index)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thumbnail URL (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter thumbnail URL"
                  value={section.thumbnail}
                  onChange={(e) => handleSectionChange(e, index, "thumbnail")}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => handleUpload(index)}
              >
                Upload Video {section.slot}
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* Display Uploaded Videos */}
      <h3 className="mb-3">Uploaded Videos</h3>
      <div className="row">
        {videos.map((video) => (
          <div key={video.id} className="col-md-4 mb-3">
            <div className="card">
              <video controls className="w-100">
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-body">
                <h5>{video.title}</h5>
                {video.thumbnail && (
                  <img src={video.thumbnail} alt="Thumbnail" className="img-fluid" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDashboard;
