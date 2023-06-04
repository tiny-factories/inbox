import { useState, useEffect } from "react";
// NEED TO MAKE API PATH FOR USER
const Dropdown = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
	const fetchOptions = async () => {
	  try {
		const response = await fetch("/api/dropdown");
		const data = await response.json();
		setOptions(data);
	  } catch (error) {
		console.error("Failed to fetch dropdown options:", error);
	  }
	};

	fetchOptions();
  }, []);

  return (
	<select>
		<option key="00" value="clidlt84t0000nj92s7qzzx8w">
		  gndclouds
		</option>
	  {options.map((option) => (
		<option key={option.id} value={option.value}>
		  {option.label}
		</option>
	  ))}
	  <style jsx>{`
		  select {
			width: 100%;
			padding: 0.5rem;
			margin: 0.5rem 0;
			border-radius: 0.25rem;
			border: 0.125rem solid rgba(0, 0, 0, 0.2);
		  }
	  
		
		`}</style>

	</select>
	
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.user.findMany({
	select: {
		id: true,
		name: true,
	  },
  });
  return {
	props: { feed },
	revalidate: 10,
  };
};

export default Dropdown;
