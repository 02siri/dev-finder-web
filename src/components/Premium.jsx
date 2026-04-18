const Premium = () => {
    return <div>
        <div className="m-10">
        <div className="flex w-full">
  <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
    <h1 className="font-bold text-3xl">Silver Membership</h1>
    <ul>
        <li>• Chat with other people</li>
        <li>• 100 Connection Requests per day</li>
        <li>• Verified Account</li>
        <li>• 3 Months</li>
    </ul>
    <button className="btn btn-secondary">Buy Membership</button>
    
    </div>
  <div className="divider divider-horizontal">OR</div>
  <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
     <h1 className="font-bold text-3xl">Gold Membership</h1>
     <ul>
        <li>• Chat with other people</li>
        <li>• Unlimiited Connection Requests per day</li>
        <li>• Verified Account</li>
        <li>• 6 Months</li>
    </ul>
    <button className="btn btn-primary">Buy Membership</button>
  </div>
</div>
</div>
    </div>
};

export default Premium;