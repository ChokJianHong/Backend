document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("banner-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // Extract form data
      const title = form.bannerTitle.value;
      const position = form.bannerPosition.value;
      const imageUpload = form.bannerImage.files[0];
      const status = form.bannerStatus.value;
      
  
      // Create formData object to send to API
      const formData = new FormData();
      formData.append("banner_title", title);
      formData.append("banner_position", position);
      formData.append("image", imageUpload);
      formData.append("banner_status", status);
      console.log(formData);    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "login.html";
        }
        const response = await fetch(
          "http://localhost:5005/dashboarddatabase/banner",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 401) {
          window.location.href = "login.html";
        }
        if (response.ok) {
          const responseData = await response.json();
          console.log("Banner created successfully!", responseData);
          window.location.href = "banner.html";
          return;
        } else {
          throw new Error("Failed to create banner");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = "login.html";
        }
        console.error("Error creating banner:", error);
        alert("Banner position already exist!");
      }
    });

    const baseURL = "http://localhost:5005/dashboarddatabase";

    function fetchBannerById(BannerId) {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        if (!token) {
        console.error("No token found in local storage");
        return Promise.reject(new Error("No token found in local storage"));
        }

        return fetch(`${baseURL}/admin/banner/${BannerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Include token in Authorization header
        },
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error("Failed to fetch banner details");
            }
            return response.json(); // Parse response JSON and return the data
        })
        .catch((error) => {
            console.error("Error fetching banner details:", error);
            throw error; // Re-throw the error to propagate it further
        });
    }

    // Function to fetch and display banner data
    function fetchBanners() {
        const token = localStorage.getItem("token");
        if (!token) {
        console.error("No token found in local storage");
        return;
        }
        fetch(`${baseURL}/admin/banner`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 401) {
            window.location.href = "unauthorize_response.html";
            } else if (data.status === 200) {
            const bannerDetails = document.getElementById("banner-details");
            bannerDetails.innerHTML = ""; // Clear existing table rows
            console.log(data.data);
            data.data.forEach((banner) => {
                const row = `
                        <tr>
                            <td>${banner.banner_title}</td>
                            <td>
                                <img src="${banner.banner_img}" class="banner_img" id="img-${banner.banner_id}">                            
                                <br>
                                <span class="copy-link" id="copy-${banner.banner_id}" style="cursor: pointer;  background-color: white; border-radius: 5px; font-weight: bold; padding: 3px; font-size: 14px; background-color: #707070; color: white;">Copy Link+</span>
                                <br>
                                <span class="pixel-dimensions" id="dimensions-${banner.banner_id}">Dimensions: ${banner.banner_dimension}</span>
                            </td>
                            <td>${banner.banner_status}</td>
                            <td>
                            <div class="btn-group" role="group" aria-label="Toggle Status">
                                <button type="button" class="btn btn-primary edit" data-toggle="update-form" data-target="#update-form" data-banner-id="${banner.banner_id}" id="edit-${banner.banner_id}" onclick="toggleEdit()"><i class="fas fa-edit"></i></button>
                            </div>
                            </td>
                        </tr>
                    `;
                    bannerDetails.innerHTML += row;                    
            });

            const editButtons = document.querySelectorAll(".edit");
            editButtons.forEach((button) => {
              button.addEventListener("click", (event) => {
                const bannerId = event.currentTarget.dataset.bannerId;
                fetchBannerByIdForEdit(bannerId);
                // Scroll to the top of the page
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth" // Optional: Smooth scrolling effect
                });
              });
            });
            
            // Attach event listeners to images and copy link texts for copying URL
            const bannerImages = document.querySelectorAll(".banner_img");
            const copyLinks = document.querySelectorAll(".copy-link");
            
            const copyToClipboard = (url) => {
                navigator.clipboard.writeText(url)
                    .then(() => {
                        alert("Image URL copied to clipboard!");
                    })
                    .catch((error) => {
                        console.error("Error copying image URL:", error);
                    });
            };
            
            bannerImages.forEach((img) => {
                img.addEventListener("click", (event) => {
                    const imageUrl = event.currentTarget.src;
                    copyToClipboard(imageUrl);
                });
            });

            copyLinks.forEach((link) => {
                link.addEventListener("click", (event) => {
                    const imageUrl = event.currentTarget.previousElementSibling.src;
                    copyToClipboard(imageUrl);
                });
            });

            // Attach event listeners after adding table rows
            } else {
            console.error("Login failed:", data.message);
            }
        })
        .catch((error) => console.error("Error fetching banners:", error));
    }

    // Call fetchBanner to populate banner details initially
    fetchBanners();


    // Functions to update banner
    function fetchBannerByIdForEdit(bannerId) {
        return fetchBannerById(bannerId)
          .then((data) => {
            const banner = data.data;
            const editModal = document.getElementById("update-form");
    
            editModal.querySelector(".title").value = banner.banner_title;
            
            const statusSelect = editModal.querySelector(".status");
            statusSelect.value = banner.banner_status; // Set the value directly
            
            editModal.querySelector(".position").value = banner.banner_position;
    
            const editBannerBtn = document.getElementById("update-banner");
            editBannerBtn.addEventListener(
              "click",
              async (event) => {
                event.preventDefault();
                const data = fetchUpdateFormData();
                console.log(data);
                updateBannerById(bannerId, data);
                window.location.href = "banner.html";
              },
              { once: true }
            );
          })
          .catch((error) => {
            console.error("Error fetching banner details for edit:", error);
            throw error; // Re-throw the error to propagate it further
          });
    }

    function fetchUpdateFormData() {
        const editForm = document.getElementById("edit-form");
        
        // Get form data
        
        const title = editForm.editTitle.value;
        const position = editForm.editPosition.value;
        const imageUpload = editForm.editImage.files[0];
        const status = editForm.editStatus.value;
        
    
        // Create a JavaScript object with login data
        const editFormData = {
          title,
          position,
          imageUpload,
          status,
        };
    
        return editFormData;
      }

    function updateBannerById(bannerId, updatedBannerData) {
    console.log("banner Id", bannerId);
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found in local storage");
        window.location.href = "login.html";
    }
    const formData = new FormData();

    // Append title and status to formData
    formData.append("title", updatedBannerData.title);
    formData.append("position", updatedBannerData.position);
    formData.append("status", updatedBannerData.status);

    // Check if image data is present
    if (updatedBannerData.imageUpload) {
        formData.append("image", updatedBannerData.imageUpload);
    }
    console.log(formData);
    fetch(`${baseURL}/admin/banner/${bannerId}`, {
        method: "PUT",
        headers: {
            Authorization: `${token}`,
        },
        body: formData, // Use formData instead of JSON.stringify
    })
        .then((response) => {
        console.log(response);

        if (!response.ok) {
            throw new Error("Failed to update banner details");
        }
        return response.json();
        })
        .then((data) => {
        if (data.status === 401) {
            window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
            console.log("Banner details updated successfully");
            
            fetchBanners(); // Refresh customer list
        } else {
            console.error("Login failed:", data.message);
        }
        })
        .catch((error) =>
        console.error("Error updating banner details:", error)
        );
    }

  
    const logout = document.getElementById("logout");
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });

    fetchBanners();
  });