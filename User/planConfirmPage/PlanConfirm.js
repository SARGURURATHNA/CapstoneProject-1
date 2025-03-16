function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("cost").textContent = params.get("cost");
    document.getElementById("validity").textContent = params.get("validity");
    document.getElementById("data").textContent = params.get("data");
    document.getElementById("sms").textContent = params.get("sms");
    document.getElementById("calls").textContent = params.get("calls");
}

window.onload = getQueryParams;
    
function goToPayment(){
    let planId = new URLSearchParams(window.location.search).get("planId");
    let cost = document.getElementById("cost").textContent;
    let validity = document.getElementById("validity").textContent;
    let data = document.getElementById("data").textContent;
    let sms = document.getElementById("sms").textContent;
    let calls = document.getElementById("calls").textContent;
    
    const url = `../paymentPage/Payment.html?planId=${planId}&cost=${cost}&validity=${validity}&data=${data}&sms=${sms}&calls=${calls}`;
    window.location.href = url;
}
    
function goBack() {
    if (document.referrer) {
        window.location.href = document.referrer;
    } else {
        window.location.href = "../indexPage/Home.html";
    }
}
