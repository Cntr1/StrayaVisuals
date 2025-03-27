import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase-config";
import styles from "../ContactDashboard.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import imageCompression from "browser-image-compression";

const ContactDashboard = () => {
  const [user, setUser] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const [saving, setSaving] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [socials, setSocials] = useState([]);
  const [loadingSocials, setLoadingSocials] = useState(true);
  const [editingSocialId, setEditingSocialId] = useState(null);
  const [updatedSocials, setUpdatedSocials] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [readMessages, setReadMessages] = useState({});

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "socials"));
        const socialOrder = [
          "xBU1afPDPfOroSUZBWp6",
          "Ehiy8FCG10N0NzB4E5cQ",
          "JtTNf3dWfmQnzoutV0as",
        ];
        const socialsData = [];

        querySnapshot.forEach((doc) => {
          socialsData.push({
            originalId: doc.id,
            ...doc.data(),
          });
        });

        const sortedSocials = socialOrder
          .map((id) => socialsData.find((social) => social.originalId === id))
          .filter((social) => social !== undefined)
          .map((social, index) => ({
            id: ["fbbox", "instbox", "twtbox"][index] || social.originalId,
            originalId: social.originalId,
            platform: ["Facebook", "Instagram", "Twitter"][index] || "Unknown",
            username: social.username || "N/A",
            link: social.socialLink || "#",
            icon: social.socialIcon ? social.socialIcon : "/fallback-icon.png",
            cover: social.socialCover
              ? social.socialCover
              : "/fallback-cover.jpg",
            profile: social.socialProfile
              ? social.socialProfile
              : "/fallback-profile.jpg",
          }));

        setSocials(sortedSocials);
        setLoadingSocials(false);
      } catch (error) {
        console.error("Error fetching socials: ", error);
        setLoadingSocials(false);
      }
    };

    fetchSocials();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const packageIds = [
      "bsNLepR9f1Gj9yFenTbm",
      "q7MT2hanXirpRTUVMmDQ",
      "66r7pumc0E12VaXWXDfP",
    ];
    const unsubscribe = onSnapshot(collection(db, "packages"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const orderedData = packageIds
        .map((id) => data.find((pkg) => pkg.id === id))
        .filter((pkg) => pkg);
      setPackages(orderedData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesRef = collection(db, "contactMessages");
    const q = query(messagesRef, orderBy("submittedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate(),
        isRead: doc.data().isRead || false,
      }));

      setContactMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), {
        isRead: true,
      });
      setReadMessages((prev) => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error("Error marking as read: ", error);
    }
  };

  const handleUnmarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), {
        isRead: false,
      });
      setReadMessages((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Error unmarking as read: ", error);
    }
  };

  const handleEdit = (id) => {
    setEditingRow(id);
  };

  const handleSave = async (id, updatedType, updatedPrice) => {
    setSaving(id);
    try {
      const packageRef = doc(db, "packages", id);
      const updatedFields = {};
      if (updatedType) updatedFields.packageType = updatedType;
      if (updatedPrice) updatedFields.packagePrice = updatedPrice;
      await updateDoc(packageRef, updatedFields);
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating package:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSocialEdit = (id, social) => {
    setEditingSocialId(id);
    setUpdatedSocials({
      ...social,
      link: social.link,
    });
    setSelectedFiles({});

    setTimeout(() => {
      const container = document.querySelector(
        `.${styles["contactdashboard-socials-container"]}`,
      );
      if (container) {
        const offset = -80;
        const elementPosition =
          container.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition + offset,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingSocialId(null);
    setUpdatedSocials({});
    setSelectedFiles({});
  };

  const handleInputChange = (e, field) => {
    setUpdatedSocials({ ...updatedSocials, [field]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFiles({ ...selectedFiles, [field]: file });
      const previewUrl = URL.createObjectURL(file);
      setUpdatedSocials((prev) => ({
        ...prev,
        [field]: previewUrl,
      }));
    }
  };

  const handleDeleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?",
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "contactMessages", id));
        setContactMessages((prev) => prev.filter((msg) => msg.id !== id));
      } catch (error) {
        console.error("Error deleting message: ", error);
        alert("Failed to delete the message. Please try again.");
      }
    }
  };

  const handleSaveSocial = async (id) => {
    setSaving(id);
    try {
      const uploadPromises = Object.entries(selectedFiles).map(
        async ([field, file]) => {
          const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(file, options);

          const storageRef = ref(
            storage,
            `images/contact/socials-uploads/${compressedFile.name}`,
          );
          await uploadBytes(storageRef, compressedFile);
          return getDownloadURL(storageRef);
        },
      );

      const downloadURLs = await Promise.all(uploadPromises);

      const updateData = {
        username: updatedSocials.username,
        socialLink: updatedSocials.link,
      };

      const newImages = { ...updatedSocials };

      Object.entries(selectedFiles).forEach(([field], index) => {
        const firebaseField = `social${field.charAt(0).toUpperCase() + field.slice(1)}`;
        updateData[firebaseField] = downloadURLs[index];
        newImages[field] = downloadURLs[index];
      });

      const originalId = socials.find((s) => s.id === id)?.originalId || id;

      await updateDoc(doc(db, "socials", originalId), updateData);

      sessionStorage.setItem(`social_${id}`, JSON.stringify(newImages));

      setSocials((prevSocials) =>
        prevSocials.map((s) => (s.id === id ? { ...s, ...newImages } : s)),
      );

      setEditingSocialId(null);
      setSelectedFiles({});

      setTimeout(() => {
        const container = document.querySelector(
          `.${styles["contactdashboard-socials-container"]}`,
        );
        if (container) {
          const offset = -550;
          const elementPosition =
            container.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition + offset,
            behavior: "smooth",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error updating social media entry:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className={styles.dashboardContainer}
      style={{ marginTop: "-40px" }}
    >
      <div className={styles.innerWrapper}>
        <div className={styles.headerActions1}>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => navigate("/admin")}
              className={`${styles.button} ${styles.brown}`}
            >
              Bookings Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/videos")}
              className={`${styles.button} ${styles.blue}`}
            >
              Video Dashboard
            </button>
            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.red}`}
            >
              Logout
            </button>
          </div>
        </div>
        <h1
          className={styles.title}
          style={{
            fontWeight: "900",
            textShadow: "0 0 1px black, 0 0 1px black, 0 0 1px black",
          }}
        >
          Contact Us - Update Packages & Rates
        </h1>
        <table className={styles.table} style={{ width: "800px" }}>
          <thead>
            <tr>
              <th>Package Type</th>
              <th>Package Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className={styles.tableRow}>
                <td>
                  {editingRow === pkg.id ? (
                    <input
                      type="text"
                      defaultValue={pkg.packageType}
                      className={styles.input}
                      id={`type-${pkg.id}`}
                    />
                  ) : (
                    pkg.packageType
                  )}
                </td>
                <td>
                  {editingRow === pkg.id ? (
                    <input
                      type="text"
                      defaultValue={pkg.packagePrice}
                      className={styles.input}
                      id={`price-${pkg.id}`}
                    />
                  ) : (
                    pkg.packagePrice
                  )}
                </td>
                <td>
                  {editingRow === pkg.id ? (
                    <div className={styles.buttonGroup1}>
                      <button
                        className={`${styles.button1} ${styles.gray}`}
                        onClick={() => setEditingRow(null)}
                      >
                        <i
                          className="fa fa-close"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Cancel
                      </button>
                      <button
                        className={`${styles.button1} ${styles.green}`}
                        onClick={() => {
                          const updatedType = document.getElementById(
                            `type-${pkg.id}`,
                          ).value;
                          const updatedPrice = document.getElementById(
                            `price-${pkg.id}`,
                          ).value;
                          handleSave(pkg.id, updatedType, updatedPrice);
                        }}
                        disabled={saving === pkg.id}
                      >
                        {saving === pkg.id ? (
                          <>
                            <span style={{ marginRight: "5px" }}>Saving</span>
                            <span className={styles.loader}></span>
                          </>
                        ) : (
                          <>
                            Save
                            <i
                              className="fa fa-check-circle-o"
                              style={{ marginLeft: "5px" }}
                            ></i>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`${styles.button1} ${styles.orange}`}
                      onClick={() => handleEdit(pkg.id)}
                    >
                      <i
                        className="fa fa-pencil"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1
          className={styles.title}
          style={{
            marginTop: "50px",
            fontWeight: "900",
            textShadow: "0 0 1px black, 0 0 1px black, 0 0 1px black",
          }}
        >
          Contact Us - Customer Inquiries
        </h1>
        <table className={styles.table} style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Inquiry Type</th>
              <th>Inquiry Details</th>
              <th>Sent At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contactMessages.length > 0 ? (
              [...contactMessages]
                .sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1))
                .map((msg) => (
                  <tr
                    key={msg.id}
                    className={styles.tableRow}
                    style={{
                      textDecoration: msg.isRead ? "line-through" : "none",
                      opacity: msg.isRead ? 0.6 : 1,
                    }}
                  >
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.phoneNumber}</td>
                    <td>
                      {msg.inquiryType === "other"
                        ? msg.otherInquiryType
                        : msg.inquiryType}
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {msg.inquiryDetails}
                    </td>
                    <td>{new Date(msg.submittedAt).toLocaleString()}</td>
                    <td>
                      {!msg.isRead ? (
                        <button
                          className={`${styles.button1} ${styles.blue}`}
                          onClick={() => handleMarkAsRead(msg.id)}
                        >
                          <i
                            className="fa fa-check"
                            style={{ marginRight: "5px" }}
                          ></i>
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          className={`${styles.button1} ${styles.orange}`}
                          onClick={() => handleUnmarkAsRead(msg.id)}
                        >
                          <i
                            className="fa fa-undo"
                            style={{ marginRight: "5px" }}
                          ></i>
                          Mark as Unread
                        </button>
                      )}
                      <button
                        className={`${styles.button1} ${styles.darkred}`}
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                        <i
                          className="fa fa-trash"
                          style={{ marginLeft: "5px" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h1
          className={styles.title}
          style={{
            marginTop: "50px",
            fontWeight: "900",
            textShadow: "0 0 1px black, 0 0 1px black, 0 0 1px black",
          }}
        >
          Contact Us - Update Socials
        </h1>
        <div className={styles["contactdashboard-socials-container"]}>
          {loadingSocials ? (
            <div>Loading social media links...</div>
          ) : (
            socials.map((social) => (
              <div
                key={social.id}
                className={`${styles["contactdashboard-social-box"]} ${
                  editingSocialId === social.id
                    ? styles["contactdashboard-social-box-editing"]
                    : ""
                }`}
              >
                {editingSocialId === social.id ? (
                  <div className={styles["contactdashboard-edit-container"]}>
                    <label style={{ marginTop: "10px" }}>
                      Change Icon Image:
                    </label>
                    <div
                      className={styles["contactdashboard-edit-file"]}
                      style={{ marginTop: "40px" }}
                    >
                      <input
                        style={{ marginTop: "10px" }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "icon")}
                        className={styles["contactdashboard-edit-input"]}
                      />
                      <div
                        className={styles["contactdashboard-preview-images"]}
                      >
                        <img
                          className={styles["contactdashboard-social-icon"]}
                          style={{
                            marginTop: "80px",
                            height: "50px",
                            width: "50px",
                          }}
                          src={updatedSocials.icon}
                          alt="Icon Preview"
                        />
                      </div>
                    </div>

                    <div
                      className={styles["contactdashboard-edit-file"]}
                      style={{ marginTop: "3px" }}
                    >
                      <label style={{ marginTop: "-5px" }}>
                        Change Cover Image:
                      </label>
                      <div
                        className={styles["contactdashboard-preview-images"]}
                        style={{ marginBottom: "-10px" }}
                      >
                        <img
                          className={styles["contactdashboard-landscape-image"]}
                          style={{ minWidth: "250px", marginTop: "-15px" }}
                          src={updatedSocials.cover}
                          alt="Cover Preview"
                        />
                      </div>

                      <input
                        style={{ marginTop: "18px" }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "cover")}
                        className={styles["contactdashboard-edit-input"]}
                      />
                    </div>

                    <div
                      className={styles["contactdashboard-edit-file"]}
                      style={{ marginBottom: "20px" }}
                    >
                      <label style={{ marginTop: "13px" }}>
                        Change Profile Image:
                      </label>
                      <div
                        className={styles["contactdashboard-preview-images"]}
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          style={{ marginTop: "-15px", borderRadius: "50%" }}
                          className={styles["contactdashboard-landscape-image"]}
                          src={updatedSocials.profile}
                          alt="Profile Preview"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profile")}
                        className={styles["contactdashboard-edit-input"]}
                      />
                    </div>
                    <div
                      className={styles["contactdashboard-edit-file"]}
                      style={{ marginBottom: "20px", marginTop: "-5px" }}
                    >
                      <label>Username:</label>
                      <input
                        style={{ cursor: "text" }}
                        type="text"
                        value={updatedSocials.username}
                        onChange={(e) => handleInputChange(e, "username")}
                        className={styles["contactdashboard-edit-input"]}
                        placeholder="Username"
                      />
                      <label style={{ marginTop: "20px" }}>
                        Social Media Link:
                      </label>
                      <input
                        style={{ cursor: "text" }}
                        type="text"
                        value={updatedSocials.link || ""}
                        onChange={(e) => handleInputChange(e, "link")}
                        className={styles["contactdashboard-edit-input"]}
                        placeholder="Social Media Link"
                      />
                    </div>

                    <div className={styles["contactdashboard-button-group"]}>
                      <button
                        className={`${styles.button1} ${styles.gray}`}
                        onClick={handleCancelEdit}
                        disabled={saving === social.id}
                      >
                        <i
                          className="fa fa-close"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Cancel
                      </button>
                      <button
                        className={`${styles.button1} ${styles.green}`}
                        onClick={() => handleSaveSocial(social.id)}
                        disabled={saving === social.id}
                      >
                        {saving === social.id ? (
                          <>
                            <span style={{ marginRight: "5px" }}>Saving</span>
                            <span className={styles.loader}></span>
                          </>
                        ) : (
                          <>
                            Save
                            <i
                              className="fa fa-check-circle-o"
                              style={{ marginLeft: "5px" }}
                            ></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      className={styles["contactdashboard-social-icon"]}
                      src={social.icon}
                      alt="Social Icon"
                    />
                    <div className={styles["contactdashboard-social-content"]}>
                      <img
                        className={styles["contactdashboard-landscape-image"]}
                        src={social.cover}
                        alt="Cover"
                      />
                      <img
                        className={styles["contactdashboard-profile-image"]}
                        src={social.profile}
                        alt="Profile"
                      />
                    </div>
                    <div className={styles["contactdashboard-social-username"]}>
                      {social.username}
                    </div>
                    <button
                      style={{ marginTop: "30px", padding: "8px 12px" }}
                      className={`${styles.button1} ${styles.orange}`}
                      onClick={() => handleSocialEdit(social.id, social)}
                    >
                      <i
                        className="fa fa-pencil"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactDashboard;
