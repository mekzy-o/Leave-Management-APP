function parseDate(str) {
  var mdy = str.split("-");
  return new Date(mdy[2], mdy[0] - 1, mdy[1]);
}

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

// STAFF LOGIN
$(document).ready(
  $("#login").submit(function(ev) {
    ev.preventDefault();
    if ($("#staffid").val() && $("#password").val()) {
      $.ajax({
        method: "GET",
        url: `http://localhost:3000/staffs?staffid=${$(
          "#staffid"
        ).val()}&password=${$("#password").val()}`,
        success: function(res) {
          if (!res[0]) {
            console.log(res);
            alert("Invalid Staff Details, Please contact Admin");
            location.reload();
          } else if (res[0].staffid === "admin") {
            alert("Welcome Admin");
            window.localStorage.setItem("adminId", `${res[0].staffid}`);
            window.location = "adminpage.html";
          } else {
            alert(`Welcome ${res[0].firstname}`);
            window.localStorage.clear();
            window.localStorage.setItem("userId", `${res[0].staffid}`);
            window.localStorage.setItem(
              "leavebalance",
              `${res[0].leavebanlance}`
            );
            //console.log(`${res[0].id}`);
            window.location = "userpage.html";
          }
        },
        error: function() {
          console.log(res);
          alert("Invalid Staff Details, Please contact Admin");
        }
      });
    }
  })
);

//USER REQUESTING FOR LEAVE
$(document).ready(function() {
  function addRequest(request) {
    $("#request-table").append(`<tr id='${request.id}'><td>${request.id}</td>
            <td>${request.leaveReason}</td>
            <td>${request.leaveStart}</td>
            <td>${request.leaveEnd}</td>
            <td>${request.staffid}</td>
            <td>${request.status}</td>
            <td>${request.leavebalance}</td>
            <td><button id=${request.id} class="delete">Delete</button>
                </td>
            </tr>`);
  }

  $.ajax({
    type: "GET",
    url: `http://localhost:3000/requests?staffid=${window.localStorage.userId}`,
    success: function(requests) {
      $.each(requests, function(i, request) {
        addRequest(request);
      });
    },
    error: function() {
      alert("error loading orders");
    }
  });

  $("#request-leave").on("click", function() {
    let leaveData = {
      leaveReason: $("#reason").val(),
      leaveStart: $("#date").val(),
      leaveEnd: $("#end").val(),
      staffid: window.localStorage.userId,
      status: "pending",
      leavebalance: window.localStorage.leavebalance
    };
    let diff = Math.floor(
      (Date.parse(leaveData.leaveEnd) - Date.parse(leaveData.leaveStart)) /
        86400000
    );
    if (diff > parseInt(window.localStorage.leavebalance, 10) || diff > 14) {
      alert("Your leave days is greater than your leave balance");
      location.reload();
    }
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/requests",
      data: leaveData,
      success: function(newRequest) {
        alert("Thank You! Your leave request has been sent successfully!");
        addRequest(newRequest);
      },
      error: function() {
        alert("Request could not be Sent!");
      }
    });
  });

  //USER DELETING REQUEST
  $("#request-table").delegate(".delete", "click", function() {
    let tr = $(this)
      .closest("tr")
      .attr("id");
    $.ajax({
      type: "DELETE",
      url: "http://localhost:3000/requests/" + tr,
      success: function() {
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
});

//USER LOGOUT
$(document).ready(function() {
  $("#logout").on("click", function() {
    window.localStorage.clear();
    window.location = "login.html";
  });
});
