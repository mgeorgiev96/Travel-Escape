


const refundTicket = (e)=>{
    let target = e.target
    let ticketID = ''
    if(target.classList[1]==='fa-undo-alt'){
        ticketID = target.classList[2]
        fetch('/api/refund-ticket',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id:ticketID})
        }).then(res=>{
            if(res.status===200){
                window.location.reload()
            }
        })
    }
}



window.addEventListener('click',refundTicket)