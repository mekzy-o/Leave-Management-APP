//ADMIN PUT REQUEST
$(document).ready(function() {
  function addRequest(request) {
    console.log(request);
    $("#admin-table").append(`
                <tr id='${request.id}'>
                    <td>
                        <span>${request.id}<span><br>

                    </td>
                    <td>
                        <span>${request.leaveStart}</span>

                     </td>
                     <td>
                        <span>${request.leaveEnd}</span>

                     </td>
                    <td>
                        <span>${request.leaveReason}<span>
                    </td>
                    <td>
                        <span>${request.staffid}<span>
                    </td>
                    <td>
                        <select id='request-status' disabled>
                          <option selected disabled value=${request.status}>${request.status}</option>
                          <option value="pending">pending</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                        </select>
                    </td>
                    <td>
                        <span>${request.leavebalance}<span>
                    </td>
                    <td>
                        <button class="editRequest noedit edit">Update</button>
                        <button class="saveRequest editBtn edit">Save</button>
                    </td>
                </tr>`);
  }

  var value = $(document).on("change", "#request-status", function(e) {
    textResult = this.options[e.target.selectedIndex].text;
  });

  //adding edit functionality...
  $("#admin-table").delegate(".editRequest", "click", function() {
    $("#request-status").prop("disabled", false);
    var $tr = $(this).closest("tr");
    $tr.addClass("editBtn");
  });

  $("#admin-table").delegate(".saveRequest", "click", function() {
    confirm("Are you about the decision of the Request?");
    var $tr = $(this).closest("tr");
    let data = {
      status: textResult
    };

    if (data.status === "approved") {
    }

    //put request within the save button...
    $.ajax({
      type: "PATCH",
      url: "http://localhost:3000/requests/" + $tr.attr("id"),
      data: data,
      success: function() {
        alert("updated sucessfully!");
        document.location.reload();
      },
      error: function() {
        alert("server error...update failed");
      }
    });
  });

  $.ajax({
    type: "GET",
    url: "http://localhost:3000/requests",
    success: function(requests) {
      $.each(requests, function(i, request) {
        addRequest(request);
      });
    },
    error: function() {
      alert("error loading requests");
    }
  });
});

// ADMIN ADD STAFF FUNCTIONALITY
$(document).ready(
  $("#add-staff").submit(function(ev) {
    console.log("I am here!");
    ev.preventDefault();
    let userData = {
      firstname: $("#firstname").val(),
      lastname: $("#lastname").val(),
      password: $("#password").val(),
      staffid: $("#staffid").val(),
      linemanager: $("#linemanager").val(),
      leavebanlance: $("#leavebalance").val()
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/staffs",
      data: userData,
      success: function() {
        alert("Thank You! Staff Account has been created successfully.");
        location.reload();
      },
      error: function() {
        alert("Account could not be created!");
      }
    });
  })
);

$(document).ready(function() {
  function viewStaff(request) {
    console.log(request);
    $("#staff-table").append(`
                <tr id='${request.id}'>
                    <td>
                    <span>${request.firstname}</span>
                    <input class='editBtn' id="firstnameInput">

                    </td>
                    <td>
                    <span>${request.lastname}</span>
                    <input class='editBtn' id="lastnameInput">

                     </td>
                    <td>
                        <span>${request.staffid}<span>
                    </td>
                    <td>
                        <span>${request.linemanager}<span>
                    </td>
                    <td>
                        <span>${request.leavebanlance}<span>
                    </td>
                    <td><button class="editRequest noedit edit">Update</button>
                    <button class="saveRequest editBtn edit">Save</button>
                        <button class="delete">Delete</button>
                    </td>
                </tr>`);
  }

  //EDIT FUNCTIONALITY
  $("#staff-table").delegate(".editRequest", "click", function() {
    var $tr = $(this).closest("tr");
    $tr.addClass("editBtn");
  });

  $("#staff-table").delegate(".saveRequest", "click", function() {
    var $tr = $(this).closest("tr");
    let data = {
      firstname: $("#firstnameInput").val()
    };
    console.log(request);
    $.ajax({
      type: "PATCH",
      url: "http://localhost:3000/staffs/" + $tr.attr("id"),
      data: data,
      success: function() {
        // console.log(data);
        alert("updated sucessfully!");
        document.location.reload();
      },
      error: function() {
        alert("server error...update failed");
      }
    });
  });

  //DELETE
  $("#staff-table").delegate(".delete", "click", function() {
    let tr = $(this)
      .closest("tr")
      .attr("id");
    $.ajax({
      type: "DELETE",
      url: "http://localhost:3000/staffs/" + tr,
      success: function() {
        confirm("Are You sure you want to delete user?");
        $(this)
          .closest("tr")
          .remove();
        location.reload();
      },
      error: function() {
        alert("delete failed");
      }
    });
  });

  $.ajax({
    type: "GET",
    url: "http://localhost:3000/staffs",
    success: function(requests) {
      $.each(requests, function(i, request) {
        viewStaff(request);
      });
    },
    error: function() {
      alert("error loading requests");
    }
  });
});
