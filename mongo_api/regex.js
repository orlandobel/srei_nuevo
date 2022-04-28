const exp = "/^[a-z-A-Z0-9.!#$%&'*+/=?^_`{|}`~-]+@[a-z-A-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";

if("orlando.bel@gmail.com".match(exp))
    console.log("paso");
else   
    console.log("no paso");