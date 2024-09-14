import { ConnectButton } from 'arweave-wallet-kit';
import { Link } from 'react-router-dom';

const Nav: React.FC = () => {
  return (

      <nav className='flex flex-row justify-between w-[100vw] px-9 my-4'>
        <h4 className='text-[21px]'>Simulated FE</h4>
        <ul className='flex flex-row gap-6 items-center justify-center'>
          <li><Link to="/register">Register Project</Link></li>
          <li><Link to="/saturn">Saturn</Link></li>
          <ConnectButton accent="#25291C" profileModal={true} showBalance={false} />
        </ul>
      </nav>

  );
};

export default Nav;
