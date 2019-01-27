import hashicon from 'hashicon';

export default ({hash} : any)=>{
    return hashicon(hash, {
        size: 100
    })
}