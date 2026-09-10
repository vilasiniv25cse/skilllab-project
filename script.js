// =====================================
// DIGITAL MEMBERSHIP MANAGEMENT SYSTEM
// =====================================


// ---------- DEFAULT MEMBER DATA ----------

let members = JSON.parse(localStorage.getItem("members")) || [
    {
        id: "MBR10245",
        name: "Vilasini",
        email: "member@gmail.com",
        password: "1234",
        plan: "Premium",
        price: 999,
        startDate: "01 July 2026",
        expiryDate: "30 December 2026",
        status: "Active"
    },
    {
        id: "MBR10246",
        name: "Rahul",
        email: "rahul@gmail.com",
        password: "1234",
        plan: "Basic",
        price: 499,
        startDate: "-",
        expiryDate: "-",
        status: "Pending"
    },
    {
        id: "MBR10247",
        name: "Ananya",
        email: "ananya@gmail.com",
        password: "1234",
        plan: "Annual",
        price: 1499,
        startDate: "01 January 2025",
        expiryDate: "31 December 2025",
        status: "Expired"
    }
];


// ---------- SAVE DATA ----------

function saveMembers() {
    localStorage.setItem("members", JSON.stringify(members));
}


// ---------- LOGIN ----------

function loginUser() {

    const type = document.getElementById("loginType").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }


    // ADMIN LOGIN

    if (type === "admin") {

        if (
            email === "admin@gmail.com" &&
            password === "admin123"
        ) {

            localStorage.setItem("loggedInUser", "admin");

            alert("Admin login successful!");

            document.getElementById("admin")
                .scrollIntoView({
                    behavior: "smooth"
                });

            updateAdminDashboard();

        } else {

            alert("Invalid admin email or password.");

        }

        return;
    }


    // MEMBER LOGIN

    const member = members.find(
        user =>
            user.email === email &&
            user.password === password
    );


    if (member) {

        localStorage.setItem(
            "loggedInUser",
            member.email
        );

        localStorage.setItem(
            "currentMemberId",
            member.id
        );

        alert("Login successful!");

        loadMemberData();

        document.querySelector(".dashboard")
            .scrollIntoView({
                behavior: "smooth"
            });

    } else {

        alert("Invalid email or password.");

    }
}


// ---------- LOAD MEMBER DATA ----------

function loadMemberData() {

    const memberId =
        localStorage.getItem("currentMemberId");

    const member = members.find(
        user => user.id === memberId
    );

    if (!member) return;


    const dashboardCards =
        document.querySelectorAll(".dashboard .card");


    if (dashboardCards.length >= 4) {

        dashboardCards[0]
            .querySelector("p")
            .textContent = member.plan + " Membership";

        dashboardCards[1]
            .querySelector("p")
            .textContent = member.id;

        dashboardCards[2]
            .querySelector("span")
            .textContent = member.status;

        dashboardCards[3]
            .querySelector("p")
            .textContent = member.expiryDate;

    }


    // UPDATE STATUS PAGE

    const statusCard =
        document.querySelector(".status-card");

    if (statusCard) {

        const title =
            statusCard.querySelector("h3");

        if (title) {
            title.textContent =
                member.plan + " Membership";
        }

        const paragraphs =
            statusCard.querySelectorAll("p");

        if (paragraphs.length >= 4) {

            paragraphs[0].textContent =
                "Membership ID: " + member.id;

            paragraphs[1].textContent =
                "Member Name: " + member.name;

            paragraphs[2].textContent =
                "Start Date: " + member.startDate;

            paragraphs[3].textContent =
                "Expiry Date: " + member.expiryDate;
        }


        const status =
            statusCard.querySelector(".active, .pending, .expired");

        if (status) {

            status.textContent =
                member.status;

            status.className =
                member.status.toLowerCase();

        }

    }

}


// ---------- SELECT MEMBERSHIP PLAN ----------

function selectPlan(plan, price, months) {

    const memberId =
        localStorage.getItem("currentMemberId");

    if (!memberId) {

        alert("Please login as a member first.");

        document.getElementById("login")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;
    }


    const member =
        members.find(
            user => user.id === memberId
        );

    if (!member) return;


    member.plan = plan;
    member.price = price;
    member.status = "Pending";


    saveMembers();

    loadMemberData();

    alert(
        plan +
        " membership selected successfully!\n" +
        "Amount: ₹" +
        price +
        "\n\nYour application is pending admin approval."
    );


    document.getElementById("status")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ---------- RENEW MEMBERSHIP ----------

function renewMembership() {

    const memberId =
        localStorage.getItem("currentMemberId");

    if (!memberId) {

        alert("Please login first.");
        return;

    }


    const member =
        members.find(
            user => user.id === memberId
        );

    if (!member) return;


    const confirmRenew =
        confirm(
            "Do you want to renew your " +
            member.plan +
            " membership?"
        );


    if (!confirmRenew) return;


    const today =
        new Date();


    const months =
        member.plan === "Basic"
            ? 3
            : member.plan === "Premium"
            ? 6
            : 12;


    const expiry =
        new Date(today);

    expiry.setMonth(
        expiry.getMonth() + months
    );


    member.startDate =
        formatDate(today);

    member.expiryDate =
        formatDate(expiry);

    member.status =
        "Active";


    saveMembers();

    loadMemberData();

    alert(
        "Membership renewed successfully!"
    );
}


// ---------- DATE FORMAT ----------

function formatDate(date) {

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


// ---------- ADMIN DASHBOARD ----------

function updateAdminDashboard() {

    const total =
        members.length;

    const active =
        members.filter(
            m => m.status === "Active"
        ).length;

    const pending =
        members.filter(
            m => m.status === "Pending"
        ).length;

    const expired =
        members.filter(
            m => m.status === "Expired"
        ).length;


    const cards =
        document.querySelectorAll(
            ".admin-card h1"
        );


    if (cards.length >= 4) {

        cards[0].textContent = total;
        cards[1].textContent = active;
        cards[2].textContent = pending;
        cards[3].textContent = expired;

    }


    displayMembers();
}


// ---------- DISPLAY MEMBERS ----------

function displayMembers(
    list = members
) {

    const table =
        document.querySelector("table");

    if (!table) return;


    table.innerHTML = `

        <tr>
            <th>Member ID</th>
            <th>Name</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Action</th>
        </tr>

    `;


    list.forEach(member => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${member.id}</td>

            <td>${member.name}</td>

            <td>${member.plan}</td>

            <td>
                <span class="${member.status.toLowerCase()}">
                    ${member.status}
                </span>
            </td>

            <td>

                ${
                    member.status === "Pending"

                    ?

                    `<button
                        class="small-btn"
                        onclick="approveMember('${member.id}')">
                        Approve
                    </button>`

                    :

                    `<button
                        class="small-btn"
                        onclick="viewMember('${member.id}')">
                        View
                    </button>`
                }

            </td>

        `;


        table.appendChild(row);

    });

}


// ---------- APPROVE MEMBER ----------

function approveMember(id) {

    const member =
        members.find(
            user => user.id === id
        );


    if (!member) return;


    member.status = "Active";


    const today =
        new Date();


    member.startDate =
        formatDate(today);


    const expiry =
        new Date(today);


    const months =
        member.plan === "Basic"
            ? 3
            : member.plan === "Premium"
            ? 6
            : 12;


    expiry.setMonth(
        expiry.getMonth() + months
    );


    member.expiryDate =
        formatDate(expiry);


    saveMembers();

    updateAdminDashboard();


    alert(
        member.name +
        "'s membership has been approved."
    );
}


// ---------- VIEW MEMBER ----------

function viewMember(id) {

    const member =
        members.find(
            user => user.id === id
        );


    if (!member) return;


    alert(

        "MEMBER DETAILS\n\n" +

        "ID: " + member.id + "\n" +

        "Name: " + member.name + "\n" +

        "Email: " + member.email + "\n" +

        "Plan: " + member.plan + "\n" +

        "Status: " + member.status + "\n" +

        "Start Date: " + member.startDate + "\n" +

        "Expiry Date: " + member.expiryDate

    );
}


// ---------- SEARCH MEMBERS ----------

function searchMembers() {

    const input =
        document.getElementById(
            "searchMember"
        );


    const search =
        input.value.toLowerCase();


    const filtered =
        members.filter(member =>

            member.name
                .toLowerCase()
                .includes(search)

            ||

            member.id
                .toLowerCase()
                .includes(search)

            ||

            member.plan
                .toLowerCase()
                .includes(search)

            ||

            member.status
                .toLowerCase()
                .includes(search)

        );


    displayMembers(filtered);
}


// ---------- LOGOUT ----------

function logoutUser() {

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "currentMemberId"
    );

    alert("Logged out successfully.");

    document.getElementById("home")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ---------- PAGE LOAD ----------

window.onload = function () {

    saveMembers();

    const loggedUser =
        localStorage.getItem(
            "loggedInUser"
        );


    if (loggedUser === "admin") {

        updateAdminDashboard();

    }


    if (loggedUser !== "admin") {

        loadMemberData();

    }

};
