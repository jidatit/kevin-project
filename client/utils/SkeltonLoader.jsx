const SkeletonTable = () => {
	return (
		<tbody>
			{Array.from({ length: 5 }).map((_, index) => (
				<tr
					className={`${
						index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
					} animate-pulse`}
					key={index}
				>
					<td
						className={`py-2 px-3 font-normal text-base ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 font-normal text-base ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 font-normal text-base ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 text-base font-normal ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 text-base font-normal ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 text-base font-normal ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
					<td
						className={`py-2 px-3 text-base font-normal ${
							index === 0 ? "border-t-2 border-gray-300" : "border-t"
						} whitespace-nowrap`}
					>
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
					</td>
				</tr>
			))}
		</tbody>
	);
};

export default SkeletonTable;
