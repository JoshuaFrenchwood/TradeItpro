import React from 'react'

export default function Footer() {
    return (
        <div>
            <footer className="bg-dark text-white  text-center footer-use" >
                Copyright &copy; {new Date().getFullYear()} TradeIt
            </footer>
        </div>
    )
}
