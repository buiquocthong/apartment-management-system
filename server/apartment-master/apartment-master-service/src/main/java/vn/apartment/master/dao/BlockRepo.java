package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.apartment.Block;

import java.util.Optional;

@Repository
public interface BlockRepo extends JpaRepository<Block, Long> {
    Optional<Block> findByName(String name);
    Optional<Block> findByBlockId(String blockId);
    @Query(value = "select b from Block b inner join Floor f on f.block.id = b.id inner join Apartment a on a.floor.id = f.id where a.apartmentId = :apartmentId")
    Optional<Block> findByApartmentId(@Param("apartmentId") final String apartmentId);
    @Query("select b from Block b inner join Floor f on f.block.id = b.id where f.floorId = :floorId")
    Optional<Block> findByFloorId(@Param("floorId") final String floorId);
}
