import Image from 'next/image';

function Banner() {
    return (
        <div style={{
            position: 'relative', 
            zIndex: 10,         
            width: '100%',       
            height: '100vh',    
            overflow: 'hidden'   
        }}>
            <Image
                src="https://links.papareact.com/0fm"
                layout='fill'
                objectFit='cover'
                alt=""
            />
        </div>
    );
}

export default Banner;
