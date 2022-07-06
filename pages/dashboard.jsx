const Dashboard = () => {
  return (
    <div className="main">
      <h1 className="display-middle">👍</h1>
    </div>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
    },
  };
}

export default Dashboard;
