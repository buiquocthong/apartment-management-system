package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.apartment.Floor;

import java.util.List;
import java.util.Optional;

@Repository
public interface FloorRepo extends JpaRepository<Floor, Long>{
    Optional<Floor> findByFloorId(String floorId);
    @Query(value = "select f from Floor f join f.block b where b.blockId = :blockId")
    List<Floor> findByBlockId(@Param("blockId") String blockId);
}
