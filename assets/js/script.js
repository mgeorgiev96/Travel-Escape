let packageMadagascar = document.querySelector('.madagascar-book'),
datepickerCustom = document.querySelector('.datepicker-custom'),
datepickerFlight = document.querySelector('.datepicker-flight'),
datepickerFlightReturn = document.querySelector('.datepicker-flight-return'),
datepickerCustomCheckout = document.querySelector('.datepicker-custom-checkout'),
packageHawaii = document.querySelector('.hawaii-book'),
packageAustria = document.querySelector('.austria-book'),
packageUSA = document.querySelector('.usa-book'),
packageCanada = document.querySelector('.canada-book'),
packageEgypt = document.querySelector('.egypt-book'),
numberOfAdults = 0,
numberOfChildren = 0,
tripDestination = '',
tripFullPrice = 0,
tripTax = 0,
checkInDate = '',
checkOutDate = '',
flightFrom = '',
flightTo = '',
flightClass = ''
flightAdults = '',
flightChildren = '',
flightDeparture = '',
flightReturn = '',
logoutButton = document.querySelector('.logout_button'),
ticketsButton = document.querySelector('.tickets_button'),
subscribeButton = document.querySelector('.subscribe-btn'),
sydneyOffer = document.querySelector('.special-offer-sydney')


//Fetch Subscribe Info

const gatherSubscribeInfo = ()=>{
    let subscribeMenuBTN = document.querySelector('.subscription_menu'),
    emailField = document.querySelector('.email_field')
    fetch('/api/info').then(i=>i.json()).then(res=>{
        if(res.subscribed===true){
            subscribeButton.innerHTML = 'Unsubscribe'
            emailField.value = res.email
            subscribeMenuBTN.innerHTML = 'Unsubscribe'
        }else{
            emailField.value = res.email
        }
    })
}

gatherSubscribeInfo()

//Subscribe

subscribeButton.addEventListener('click',(e)=>{
    e.preventDefault()
    fetch('/api/subscribe').then(res=>{
        if(res.status===200){
            window.location.reload()
        }
    })
})


//Redirect to tickets page

ticketsButton.addEventListener('click',(req,res)=>{
    window.location.replace('/api/tickets')
})

//Logout from profile
logoutButton.addEventListener('click',(req,res)=>{
    fetch('/api/logout').then(res=>window.location.replace('/'))
})



//Datepickers min-date configuration

datepickerCustom.addEventListener('click',(e)=>{
    let target = e.target
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    target.min = `${year}-${month<10 ? '0' + month: month}-${day < 10 ? '0' + day : day}`
})
datepickerCustomCheckout.addEventListener('click',(e)=>{
    let target = e.target
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    if(datepickerCustom.value){
        target.min = datepickerCustom.value
    }else{
        target.min = `${year}-${month<10 ? '0' + month: month}-${day < 10 ? '0' + day : day}`
    }
})
datepickerFlight.addEventListener('click',(e)=>{
    let target = e.target
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    target.min = `${year}-${month<10 ? '0' + month: month}-${day < 10 ? '0' + day : day}`
})
datepickerFlightReturn.addEventListener('click',(e)=>{
    let target = e.target
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    if(datepickerFlight.value){
        target.min = datepickerFlight.value
    }else{
        target.min = `${year}-${month<10 ? '0' + month: month}-${day < 10 ? '0' + day : day}`
    }
})

let saveButton = document.querySelector('.save-button')
let saveButtonFlight = document.querySelector('.save-button-flight')

const saveInfo = (e)=>{
let target = e.target
//Save information for trip - current tab

let currentTabInfo = target.parentElement.parentElement.parentElement.parentElement
if(currentTabInfo.classList[1]==='hotel-info'){
    let checkIN = currentTabInfo.children[0].children[1].children[0].children[1].children[0].children[0]
    let checkOUT = currentTabInfo.children[0].children[2].children[0].children[1].children[0].children[0]
    let adults = currentTabInfo.children[0].children[3].children[0].children[1]
    let children = currentTabInfo.children[0].children[4].children[0].children[1]
    numberOfAdults = adults.value
    if(children){
        numberOfChildren = children.value
    }
    checkInDate = checkIN.value
    checkOutDate = checkOUT.value

    checkIN.value = ''
    checkOUT.value = ''
    adults.value = ''
    children.value = ''
}else if(currentTabInfo.classList[1] === 'flight-info'){
    let fFrom = currentTabInfo.children[0].children[0].children[0].children[1],
    fTo = currentTabInfo.children[1].children[0].children[0].children[1].children[0],
    fDeparture = currentTabInfo.children[0].children[1].children[0].children[1].children[0].children[0],
    fReturn = currentTabInfo.children[0].children[2].children[0].children[1].children[0].children[0],
    fAdults = currentTabInfo.children[0].children[3].children[0].children[1],
    fChildren = currentTabInfo.children[0].children[4].children[0].children[1],
    fClass = currentTabInfo.children[1].children[1].children[0].children[1].children[0]


    flightFrom = fFrom.value
    flightTo = fTo.value
    flightDeparture = fDeparture.value
    flightReturn = fReturn.value
    flightAdults = fAdults.value
    flightChildren = fChildren.value
    flightClass = fClass.value

    fFrom.value = '',
    fTo.value = '',
    fDeparture.value = '',
    fReturn.value = '',
    fAdults.value = '',
    fChildren.value = '',
    fClass.value = ''
}
}

saveButtonFlight.addEventListener('click',saveInfo)
saveButton.addEventListener('click',saveInfo)

//Stripe payment configuration
let stripeHandler = StripeCheckout.configure({
key: 'pk_test_51GxXTwJWnlXzpGEmHhKz3nGdCrzRjY8QE4fuYMo6CNYAuJXIQCDMy2LXCAVyTbME9zrYK60HxAjBEaE9ulvYSRJ700jdk4z5x2',
locale: 'auto',
token: (token)=>{
    fetch('/api/payment',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            stripeTokenId: token.id,
            userEmail: token.email,
            nameOfPurchase: `${tripDestination.charAt(0).toUpperCase() + tripDestination.slice(1)} --- ${tripFullPrice}$. Flight Departure(${flightDeparture}) - Flight Return(${flightReturn}). Check-In/Check-Out (${checkInDate}-${checkOutDate})`,
            price: tripFullPrice * 100
        })
    }).then(r=>{
        if(r.status===200){
            window.location.reload()
        }
    })
}
})

//Packages Payment 
const openPaymentWindow = (e)=>{
let location = e.target.classList[2]
if(location==='madagascar-book'){
    tripName = 'Madagascar'
    tripAmount= 1199
}else if(location === 'hawaii-book'){
    tripName = 'Hawaii'
    tripAmount= 1499
}else if(location === 'austria-book'){
    tripName = 'Austria'
    tripAmount= 789
}else if(location === 'usa-book'){
    tripName = 'USA'
    tripAmount= 999
}else if(location === 'canada-book'){
    tripName = 'Canada'
    tripAmount= 899
}else if(location==='egypt-book'){
    tripName = 'Egypt'
    tripAmount= 1199
}
stripeHandler.open({
    amount: tripAmount * 100,
    name: 'TravelEscape',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    description: `${tripName} ${tripAmount}$`
})
}
//Open custom made vacation payment
const openDefaultPaymentWindow = (e)=>{
    let target = e.target
    //Main payment tab
    let currentTab = target.parentElement.parentElement.parentElement.parentElement

    //Price Per Flight Ticket
    let childTicket = 115
    let adultTicket = 150

    //Price Per Night
    let childSleep = 50
    let adultSleep = 75

    //Destination selected
    let destination = currentTab.children[0].children[0].children[0].children[1].children[0].value
    let datesCheckInOut = (new Date(checkInDate).getTime() - new Date(checkOutDate).getTime()) / (1000*60*60*24)
    tripDestination = destination
    if(datesCheckInOut===0){
        datesCheckInOut = 1
    }else{
        datesCheckInOut = -datesCheckInOut
    }

    //Prices for destinations


    if(destination==='italy'){
        tripTax = 150
    }else if(destination==='spain'){
        tripTax = 100
    }else if(destination==='peru'){
        tripTax = 400
    }else if(destination==='japan'){
        tripTax = 500
    }else if(destination==='greece'){
        tripTax = 150
    }else if(destination==='brazil'){
        tripTax = 400
    }

    //Prices for types of class

    if(tripDestination!=='default' && numberOfAdults && flightDeparture && flightReturn && flightFrom && flightTo && checkInDate && checkOutDate){
        if(flightClass==='first class'){
            flightClass = 2
        }else if(flightClass==='business class'){
            flightClass = 1.5
        }else if(flightClass==='premium economy'){
            flightClass = 1.25
        }else{
            flightClass = 1
        }
        if(numberOfChildren){
            tripFullPrice = (tripTax * numberOfAdults) + ((tripTax * numberOfChildren) - ((tripTax * numberOfChildren)/4)) + ((adultTicket * flightClass) * numberOfAdults) + ((childTicket * flightClass) * numberOfChildren)+
            (childSleep * datesCheckInOut ) + (adultSleep * datesCheckInOut)
        }else{
            tripFullPrice = (tripTax * numberOfAdults) + ((adultTicket * flightClass) * numberOfAdults) + ((adultSleep * datesCheckInOut)*numberOfAdults)
        }

        //Stripe Payment Window

        stripeHandler.open({
            amount: tripFullPrice * 100,
            name: 'TravelEscape',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            description: `${tripDestination.toUpperCase()} ${tripFullPrice}$ - ${numberOfAdults} adults - ${numberOfChildren} children`
        })
    }else{
        alert('Please make sure you have saved the information for the following:( Trip Destination),(Hotel Check In/Check Out/Number of Members), (Flight Departure/Return/Number of Adults) and Flight(From,To)')
    }
}


//Special Offer Payment

const specialOfferPayment = ()=>{

    tripFullPrice = 810
    tripDestination = 'Sydney'
    flightDeparture = '27/09/2021'
    flightReturn = '02/10/2021',
    checkInDate = '27/09/2021'
    checkOutDate = '02/10/2021'
    stripeHandler.open({
        amount: tripFullPrice * 100,
        name: 'TravelEscape',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        description: `${tripDestination} - ${tripFullPrice}$ - 2 person.`
    })
}

let payButton = document.querySelector('.payment-button')
payButton.addEventListener('click',openDefaultPaymentWindow)
packageMadagascar.addEventListener('click',openPaymentWindow)
packageHawaii.addEventListener('click',openPaymentWindow)
packageAustria.addEventListener('click',openPaymentWindow)
packageUSA.addEventListener('click',openPaymentWindow)
packageCanada.addEventListener('click',openPaymentWindow)
packageEgypt.addEventListener('click',openPaymentWindow)
sydneyOffer.addEventListener('click',specialOfferPayment)