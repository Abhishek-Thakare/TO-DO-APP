// pages/Profile.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword, deleteAccount } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: "", text: "" });
    try {
      // Use FormData to send both text and file together
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const res = await updateProfile(formData);
      setUser(res.data.user);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setProfilePicture(null);
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg({ type: "", text: "" });
    try {
      await changePassword(passwordForm);
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordMsg({ type: "error", text: err.response.data.errors[0].msg });
      } else {
        setPasswordMsg({ type: "error", text: err.response?.data?.message || "Failed." });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ Are you sure? This will permanently delete your account and ALL your tasks. This cannot be undone!")) return;
    if (!window.confirm("Final confirmation: Delete my account permanently?")) return;
    setDeleteLoading(true);
    try {
      await deleteAccount();
      logout();
      navigate("/");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  const avatarSrc = previewUrl
    || (user?.profilePicture ? `${process.env.REACT_APP_API_URL?.replace("/api", "")}${user.profilePicture}` : null);

  return (
    <DashboardLayout title="My Profile">
      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ---- Profile Info Card ---- */}
        <div className="glass-card" style={{ padding: 36 }}>
          <h2 style={{ marginBottom: 24, fontSize: "1.2rem", fontWeight: 800 }}>👤 Profile Information</h2>

          {profileMsg.text && (
            <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
          )}

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
            <div onClick={() => fileRef.current.click()} style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "2rem", cursor: "pointer", overflow: "hidden", border: "3px solid var(--primary)", flexShrink: 0 }}>
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>{user?.name}</div>
              <div style={{ color: "var(--text-light)", fontSize: "0.85rem", marginBottom: 8 }}>{user?.email}</div>
              <button className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()}>
                📷 Change Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>
        </div>

        {/* ---- Change Password Card ---- */}
        <div className="glass-card" style={{ padding: 36 }}>
          <h2 style={{ marginBottom: 24, fontSize: "1.2rem", fontWeight: 800 }}>🔒 Change Password</h2>

          {passwordMsg.text && (
            <div className={`alert alert-${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password <span className="text-light">(min 6 characters)</span></label>
              <input type="password" placeholder="Enter new password" value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "🔐 Change Password"}
            </button>
          </form>
        </div>

        {/* ---- Danger Zone Card ---- */}
        <div className="glass-card" style={{ padding: 36, border: "1px solid rgba(214,48,49,0.3)" }}>
          <h2 style={{ marginBottom: 8, fontSize: "1.2rem", fontWeight: 800, color: "var(--danger)" }}>⚠️ Danger Zone</h2>
          <p className="text-light" style={{ marginBottom: 20, fontSize: "0.9rem" }}>
            Deleting your account is <strong>permanent</strong>. All your tasks and data will be erased forever.
          </p>
          <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "🗑️ Delete My Account"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
